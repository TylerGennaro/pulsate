import { authOptions } from '@lib/auth';
import { Tag } from '@lib/enum';
import { db } from '@lib/prisma';
import { Location, LogType, Prisma } from '@prisma/client';
import { format } from 'date-fns';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

type CheckoutHistoryDateRangeEntry = {
	quantity: number;
	date: Date;
};

type LocationData = {
	id: string;
	name: string;
	products: { id: string; name: string }[];
};

export async function GET() {
	const session = await getServerSession(authOptions);
	if (!session)
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

	const locations = await db.location.findMany({
		select: {
			id: true,
			name: true,
			products: {
				select: {
					id: true,
					name: true,
					items: {
						select: {
							quantity: true,
						},
					},
				},
			},
		},
		where: {
			userId: session.user.id,
		},
	});
	if (locations.length === 0) return new NextResponse(null, { status: 204 });
	// const parseAllData = await Promise.all([
	// 	parseCheckoutHistory(locations),
	// 	parsePopularItems(locations),
	// 	parseStockAlerts(locations),
	// ]);
	// const checkoutHistory = parseAllData[0];
	// const popularItems = parseAllData[1];
	// const stockAlerts = parseAllData[2];
	const now = Date.now();
	const checkoutHistory = await parseCheckoutHistory(locations);
	// const time1 = Date.now() - now;
	const popularItems = await parsePopularItems(locations);
	// const time2 = Date.now() - now - time1;
	const stockAlerts = await parseStockAlerts(locations);
	// const time3 = Date.now() - now - time1 - time2;
	const totals = parseTotals(locations);
	// const time4 = Date.now() - now - time1 - time2 - time3;
	const time4 = Date.now() - now;
	// console.log('Time taken for checkout history:', time1);
	// console.log('Time taken for popular items:', time2);
	// console.log('Time taken for stock alerts:', time3);
	// console.log('Time taken for totals:', time4);
	console.log('Time taken for all:', time4);
	return NextResponse.json(
		{ checkoutHistory, popularItems, stockAlerts, totals },
		{ status: 200 }
	);
}

interface LocationTotalsParam extends LocationData {
	products: {
		id: string;
		name: string;
		items: {
			quantity: number;
		}[];
	}[];
}

function parseTotals(data: LocationTotalsParam[]) {
	const totalProducts = data.reduce(
		(acc, location) => acc + location.products.length,
		0
	);
	const totalStock = data.reduce(
		(acc, location) =>
			acc +
			location.products.reduce(
				(acc, product) =>
					acc + product.items.reduce((acc, item) => acc + item.quantity, 0),
				0
			),
		0
	);
	return {
		totalLocations: data.length,
		totalProducts,
		totalStock,
	};
}

async function parseCheckoutHistory(data: LocationData[]) {
	return await Promise.all([
		...data.map(async (location) => {
			// Grab data from last month, can group by week/2 weeks later
			// Group by day of timestamp
			if (location.products.length === 0)
				return { name: location.name, week: [], biweek: [], month: [] };
			const rawData: { date: Date; quantity: string }[] =
				await db.$queryRaw`SELECT date_trunc('day', "timestamp")::date as date, sum(quantity) as quantity FROM "Log" WHERE "type" = ${
					LogType.ITEM_CHECKOUT
				}::"LogType" AND "productId" IN (${Prisma.join(
					location.products.map((product) => product.id)
				)}) AND "timestamp" >= NOW() - INTERVAL '1 month' GROUP BY date`;
			const allEntries = rawData.map((result) => ({
				...result,
				quantity: parseInt(result.quantity),
			}));

			return {
				name: location.name,
				week: parseCheckoutHistoryResultsByDateRange(allEntries, 7, 'EEE'),
				biweek: parseCheckoutHistoryResultsByDateRange(allEntries, 14, 'MMM d'),
				month: parseCheckoutHistoryResultsByDateRange(allEntries, 30, 'MMM d'),
			};
		}),
	]);
}

async function parsePopularItems(data: LocationData[]) {
	return await Promise.all([
		...data.map(async (location) => {
			// Grab data from last month, can group by week/2 weeks later
			// Group by day of timestamp and product name
			if (location.products.length === 0)
				return { name: location.name, week: [], biweek: [], month: [] };
			const rawData: { date: Date; quantity: string; name: string }[] =
				await db.$queryRaw`SELECT sum(quantity) as quantity, "Product"."name" FROM "Log"
				INNER JOIN "Product" ON "Product"."id" = "Log"."productId"
				WHERE "type" = ${
					LogType.ITEM_CHECKOUT
				}::"LogType" AND "productId" IN (${Prisma.join(
					location.products.map((product) => product.id)
				)}) AND "timestamp" >= NOW() - INTERVAL '1 month'
				GROUP BY "Product"."name" ORDER BY quantity DESC LIMIT 10`;
			const allEntries = rawData.map((result) => ({
				...result,
				quantity: parseInt(result.quantity),
			}));

			return {
				name: location.name,
				data: allEntries,
			};
		}),
	]);
}

function parseCheckoutHistoryResultsByDateRange(
	entries: CheckoutHistoryDateRangeEntry[],
	totalDays: number,
	dateFormat: string
) {
	return Array.from({ length: totalDays }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() - (totalDays - 1 - i));
		const result = entries.find(
			(result) =>
				result.date.getUTCFullYear() === date.getUTCFullYear() &&
				result.date.getUTCMonth() === date.getUTCMonth() &&
				result.date.getUTCDate() === date.getUTCDate()
		);
		return {
			date: format(date, dateFormat),
			quantity: result ? result.quantity : 0,
		};
	});
}

type StockAlertsReturn =
	| {
			name: string;
			location: string;
			expires: string;
	  }
	| {
			name: string;
			location: string;
			quantity: number;
	  };

async function parseStockAlerts(
	locations: LocationData[]
): Promise<StockAlertsReturn[]> {
	const locationNames: Record<string, string> = locations.reduce(
		(acc, location) => ({ ...acc, [location.id]: location.name }),
		{}
	);
	const locationIds = Object.keys(locationNames);
	const lowQuantityWithItems: {
		name: string;
		quantity: number;
		location: string;
	}[] = await db.$queryRaw`
		SELECT name, CAST(SUM("quantity") as INTEGER) as quantity, "Product"."locationId" as location FROM "Item"
		INNER JOIN "Product" ON "Product"."id" = "Item"."productId"
		WHERE "Product"."locationId" IN (${Prisma.join(locationIds)})
		GROUP BY "Product"."name", "Product"."min", "Product"."locationId"
		HAVING SUM("quantity") < "Product"."min"`;

	const lowQuantityNoItemsRaw = await db.product.findMany({
		select: {
			name: true,
			locationId: true,
		},
		where: {
			items: {
				none: {},
			},
			locationId: {
				in: locationIds,
			},
		},
	});
	const lowQuantityNoItems = lowQuantityNoItemsRaw.map((product) => ({
		name: product.name,
		quantity: 0,
		location: product.locationId,
	}));

	const expiringItems: {
		name: string;
		location: string;
		expires: string;
	}[] = await db.$queryRaw`
		SELECT "Product"."name", "Product"."locationId" as location, min("Item"."expires") as expires FROM "Item"
		INNER JOIN "Product" ON "Product"."id" = "Item"."productId"
		WHERE "Item"."expires" IS NOT NULL AND "Item"."expires" <= NOW() + INTERVAL '7 days'
		AND "Product"."locationId" IN (${Prisma.join(locationIds)})
		GROUP BY "Product"."name", "Product"."locationId"`;

	return [
		...lowQuantityNoItems.map((product) => ({
			...product,
			location: locationNames[product.location],
		})),
		...lowQuantityWithItems.map((product) => ({
			...product,
			location: locationNames[product.location],
		})),
		...expiringItems.map((product) => ({
			...product,
			location: locationNames[product.location],
		})),
	];
}
