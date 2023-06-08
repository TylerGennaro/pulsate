import { authOptions } from '@lib/auth';
import { log } from '@lib/log';
import { db } from '@lib/prisma';
import { catchError } from '@lib/utils';
import { LogType } from '@prisma/client';
import { format } from 'date-fns';
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

		if (onOrder)
			log(LogType.ITEM_ORDER, {
				product: data.productId,
				quantity,
			});
		else
			log(LogType.ITEM_ADD, {
				product: data.productId,
				quantity,
				footnote: `Expiration date: ${
					date !== null ? format(date, 'MMM d, yyyy') : 'Never'
				}`,
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
		const item = await db.item.findFirst({
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

		const footnote = [
			...(date?.getTime() !== item.expires?.getTime()
				? [
						`Expiration date: ${
							item.expires !== null
								? format(item.expires, 'MMM d, yyyy')
								: 'Never'
						} → ${date !== null ? format(date, 'MMM d, yyyy') : 'Never'}`,
				  ]
				: []),
			...(quantity !== item.quantity
				? [`Quantity: ${item.quantity} → ${quantity}`]
				: []),
			...(onOrder !== item.onOrder
				? [
						`On order: ${item.onOrder ? 'Yes' : 'No'} → ${
							onOrder ? 'Yes' : 'No'
						}`,
				  ]
				: []),
		].join(', ');

		log(LogType.ITEM_UPDATE, {
			product: item.productId,
			quantity,
			footnote,
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
		const item = await db.item.findFirst({
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

		log(LogType.ITEM_REMOVE, {
			product: item.productId,
			quantity: item.quantity,
		});

		return new NextResponse('Item deleted.', { status: 200 });
	} catch (e) {
		return catchError(e);
	}
}
