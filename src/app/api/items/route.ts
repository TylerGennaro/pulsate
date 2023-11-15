import { authOptions } from '@lib/auth';
import { log } from '@lib/log';
import { db } from '@lib/prisma';
import { catchError } from '@lib/utils';
import { LogType } from '@prisma/client';
import { format } from 'date-fns';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

function formatDate(date: Date | null) {
	if (date === null) return 'Never';
	return format(date, 'MMM d, yyyy');
}

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

		const item = await db.item.findFirst({
			where: {
				productId: data.productId,
				expires: date,
				onOrder,
			},
		});
		if (item) {
			const updatedItem = await db.item.update({
				where: {
					id: item.id,
				},
				data: {
					quantity: item.quantity + quantity,
				},
			});

			if (onOrder) {
				log(LogType.ITEM_ORDER, {
					product: item.productId,
					quantity: item.quantity + quantity,
					footnote: `Duplicate items merged`,
				});
				// Update last order date
				const updatedProduct = await db.product.update({
					where: {
						id: item.productId,
					},
					data: {
						lastOrder: new Date(),
					},
				});
			} else
				log(LogType.ITEM_UPDATE, {
					product: item.productId,
					quantity: item.quantity + quantity,
					footnote: `Quantity: ${item.quantity} → ${
						item.quantity + quantity
					}, Duplicate items merged`,
				});

			return new NextResponse('Item added.', { status: 200 });
		}
		const newItem = await db.item.create({
			data: {
				productId: data.productId,
				quantity,
				expires: date,
				onOrder,
			},
		});

		if (onOrder) {
			log(LogType.ITEM_ORDER, {
				product: data.productId,
				quantity,
			});
			// Update last order date
			const updatedProduct = await db.product.update({
				where: {
					id: data.productId,
				},
				data: {
					lastOrder: new Date(),
				},
			});
		} else
			log(LogType.ITEM_ADD, {
				product: data.productId,
				quantity,
				footnote: `Expiration date: ${formatDate(date)}`,
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
		const duplicateItem = await db.item.findFirst({
			where: {
				productId: item.productId,
				expires: date,
				onOrder,
				id: {
					not: item.id,
				},
			},
		});
		if (duplicateItem) {
			const updatedItem = await db.item.update({
				where: {
					id: duplicateItem.id,
				},
				data: {
					quantity: duplicateItem.quantity + quantity,
				},
			});
			const deletedItem = await db.item.delete({
				where: {
					id,
				},
			});
			log(LogType.ITEM_UPDATE, {
				product: duplicateItem.productId,
				quantity: duplicateItem.quantity + quantity,
				footnote: `Expiration date: ${formatDate(
					duplicateItem.expires
				)}, Quantity: ${duplicateItem.quantity} → ${
					duplicateItem.quantity + quantity
				}, Duplicate items merged`,
			});
			return new NextResponse('Item updated.', { status: 200 });
		}

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
				? [`Expiration date: ${formatDate(item.expires)} → ${formatDate(date)}`]
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
