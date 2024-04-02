import { authOptions } from '@lib/auth';
import { db } from '@lib/prisma';
import { LogType } from '@prisma/client';
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
			const data = await db.log.aggregate({
				where: {
					type: LogType.ITEM_CHECKOUT,
					productId: {
						in: location.products.map((product) => product.id),
					},
				},
				_sum: {
					quantity: true,
				},
			});
			return { name: location.name, data };
		}),
	]);
	console.log(finalData);
	return NextResponse.json(finalData, { status: 200 });
}
