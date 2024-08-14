'use server';

import { authOptions } from '@lib/auth';
import { db } from '@lib/prisma';
import { ActionResponse, getErrorMessage } from '@lib/utils';
import { Item } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const schema = z
	.object({
		date: z.date(),
		quantity: z.number().int().positive(),
		onOrder: z.boolean(),
	})
	.partial();

export async function updateItem(
	itemId: number,
	productId: string,
	newItem: Partial<Item>
) {
	const session = await getServerSession(authOptions);
	if (!session) return ActionResponse.send(false, 'Unauthorized');

	try {
		schema.parse(newItem);
	} catch (error) {
		return ActionResponse.send(false, getErrorMessage(error));
	}
	let { onOrder, expires, quantity } = newItem;
	if (onOrder) expires = null;

	try {
		await db.$transaction(async (tx) => {
			const updatedItems = await tx.item.updateMany({
				data: {
					quantity: {
						increment: quantity ?? 0,
					},
				},
				where: {
					AND: {
						expires,
						onOrder,
						id: {
							not: itemId,
						},
						productId,
					},
				},
			});
			console.log(updatedItems);
			if (updatedItems.count === 0) {
				// No duplicate, update this one
				await tx.item.update({
					data: {
						quantity,
						onOrder,
						expires,
					},
					where: {
						id: itemId,
					},
				});
			} else {
				// There is a duplicate item, so delete this one
				await tx.item.delete({
					where: {
						id: itemId,
					},
				});
			}
		});
		revalidatePath('/app/[location]/' + productId, 'page');
		return ActionResponse.send(true);
	} catch (error) {
		console.error(error);
		return ActionResponse.send(false, 'Failed to update item data.');
	}
}
