import { authOptions } from '@lib/auth';
import { Tag } from '@lib/enum';
import { db } from '@lib/prisma';
import { LogType, Prisma } from '@prisma/client';
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
				},
			},
		},
		where: {
			userId: session.user.id,
		},
	});
	const checkoutHistory = await parseCheckoutHistory(locations);
	const popularItems = await parsePopularItems(locations);
	parseStockAlerts(locations.map((location) => location.id));
	return NextResponse.json({ checkoutHistory, popularItems }, { status: 200 });
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
				} AND "productId" IN (${Prisma.join(
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
				WHERE "type" = ${LogType.ITEM_CHECKOUT} AND "productId" IN (${Prisma.join(
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

async function parseStockAlerts(locationIds: string[]) {
	const lowQuantityWithItems: {
		name: string;
		quantity: number;
		location: string;
	} = await db.$queryRaw`
		SELECT name, sum("quantity") as quantity, "Product"."locationId" as location FROM "Item"
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

	const expiringItems = await db.$queryRaw`
		SELECT "Product"."name", "Product"."locationId" as location, min("Item"."expires") as expires FROM "Item"
		INNER JOIN "Product" ON "Product"."id" = "Item"."productId"
		WHERE "Item"."expires" IS NOT NULL AND "Item"."expires" <= NOW() + INTERVAL '7 days'
		AND "Product"."locationId" IN (${Prisma.join(locationIds)})
		GROUP BY "Product"."name", "Product"."locationId"`;

	console.log(expiringItems);
}
