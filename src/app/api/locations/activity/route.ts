import { authOptions } from '@lib/auth';
import { db } from '@lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session || !session?.user?.id)
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

	// Get locationId and productId from query params
	const { searchParams } = new URL(req.url);
	const locationId = searchParams.get('location');
	const productId = searchParams.get('product');

	// Check if the location exists
	if (!locationId)
		return NextResponse.json(
			{ message: 'Location not found' },
			{ status: 404 }
		);

	// Get the activity
	const logs = await db.log.findMany({
		select: {
			id: true,
			product: {
				select: {
					name: true,
					id: true,
				},
			},
			user: {
				select: {
					name: true,
					email: true,
				},
			},
			type: true,
			timestamp: true,
		},
		where: {
			product: {
				locationId,
			},
			...(productId && { productId }),
		},
		orderBy: {
			timestamp: 'desc',
		},
	});
	return NextResponse.json(logs, { status: 200 });
}
