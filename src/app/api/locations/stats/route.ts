import { authOptions } from '@lib/auth';
import { getUTCDate } from '@lib/date';
import { db } from '@lib/prisma';
import { LogType, Prisma } from '@prisma/client';
import { format } from 'date-fns';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session)
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

	const locations = await db.location.findMany({
		select: {
			name: true,
			products: {
				select: {
					id: true,
				},
			},
		},
		where: {
			userId: session.user.id,
		},
	});
	const finalData = await Promise.all([
		...locations.map(async (location) => {
			// Grab data from last month, can group by week/2 weeks later
			// Group by day of timestamp
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
				week: parseWeeklyResults(allEntries),
				biweek: parseBiweeklyResults(allEntries),
				month: parseMonthlyResults(allEntries),
			};
		}),
	]);
	return NextResponse.json(finalData, { status: 200 });
}

type DateRangeEntry = {
	quantity: number;
	date: Date;
};

function parseWeeklyResults(entries: DateRangeEntry[]) {
	const TOTAL_DAYS = 7;
	return Array.from({ length: TOTAL_DAYS }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() - (TOTAL_DAYS - 1 - i));
		const result = entries.find(
			(result) =>
				result.date.getUTCFullYear() === date.getUTCFullYear() &&
				result.date.getUTCMonth() === date.getUTCMonth() &&
				result.date.getUTCDate() === date.getUTCDate()
		);
		return {
			date: format(date, 'EEE'),
			quantity: result ? result.quantity : 0,
		};
	});
}

function parseBiweeklyResults(entries: DateRangeEntry[]) {
	const TOTAL_DAYS = 14;
	return Array.from({ length: TOTAL_DAYS }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() - (TOTAL_DAYS - 1 - i));
		const result = entries.find(
			(result) =>
				result.date.getUTCFullYear() === date.getUTCFullYear() &&
				result.date.getUTCMonth() === date.getUTCMonth() &&
				result.date.getUTCDate() === date.getUTCDate()
		);
		return {
			date: format(date, 'M/d'),
			quantity: result ? result.quantity : 0,
		};
	});
}

function parseMonthlyResults(entries: DateRangeEntry[]) {
	const TOTAL_DAYS = 30;
	return Array.from({ length: TOTAL_DAYS }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() - (TOTAL_DAYS - 1 - i));
		const result = entries.find(
			(result) =>
				result.date.getUTCFullYear() === date.getUTCFullYear() &&
				result.date.getUTCMonth() === date.getUTCMonth() &&
				result.date.getUTCDate() === date.getUTCDate()
		);
		return {
			date: format(date, 'M/d'),
			quantity: result ? result.quantity : 0,
		};
	});
}
