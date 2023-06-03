import { authOptions } from '@lib/auth';
import { db } from '@lib/prisma';
import { catchError } from '@lib/utils';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
	date: z.coerce.date().nullable(),
	quantity: z.coerce.number().int().positive(),
	onOrder: z.coerce.boolean(),
});

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	const userId = session?.user?.id;
	if (!userId) return new NextResponse('Unauthorized', { status: 401 });

	const data = await req.json();

	try {
		const { date, quantity, onOrder } = schema.parse(data);
		if (!data.productId)
			return new NextResponse('Invalid product ID.', { status: 400 });

		const newItem = await db.item.create({
			data: {
				productId: data.productId,
				quantity,
				expires: date,
				onOrder,
			},
		});

		return new NextResponse('Item added', {
			status: 200,
		});
	} catch (e) {
		return catchError(e);
	}
}

export async function PUT(req: Request) {
	const session = await getServerSession(authOptions);
	const userId = session?.user?.id;
	if (!userId) return new NextResponse('Unauthorized', { status: 401 });

	const { searchParams } = new URL(req.url);
	const data = await req.json();
	const id = searchParams.get('id') || '';

	try {
		const { date, quantity, onOrder } = schema.parse(data);
		const item = db.item.findFirst({
			where: {
				id,
			},
		});
		if (!item) return new NextResponse('Could not find item.', { status: 404 });
		const updatedItem = await db.item.update({
			where: {
				id,
			},
			data: {
				expires: date,
				quantity,
				onOrder,
			},
		});
		return new NextResponse('Item updated.', { status: 200 });
	} catch (e) {
		return catchError(e);
	}
}

export async function DELETE(req: Request) {
	const session = await getServerSession(authOptions);
	const userId = session?.user?.id;
	if (!userId) return new NextResponse('Unauthorized', { status: 401 });

	const { searchParams } = new URL(req.url);
	const id = searchParams.get('id') || '';

	try {
		const item = db.item.findFirst({
			where: {
				id,
			},
		});
		if (!item) return new NextResponse('Could not find item.', { status: 404 });
		const deletedItem = await db.item.delete({
			where: {
				id,
			},
		});
		return new NextResponse('Item deleted.', { status: 200 });
	} catch (e) {
		return catchError(e);
	}
}
