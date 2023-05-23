'use server';

import { db } from '@lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addItem(fields: FormData, userId?: string) {
	const payload: { status: number; message: string } = await new Promise(
		async (res, rej) => {
			if (!userId)
				return res({
					status: 401,
					message: 'Could not authorize the request.',
				});
			const data = {
				date: new Date(fields.get('date') as string),
				quantity: parseInt(fields.get('quantity') as string) || 1,
				location: fields.get('location') as string,
				product: fields.get('product') as string,
			};

			if (!data.date)
				return res({ status: 400, message: 'Invalid date provided.' });
			if (!data.quantity || data.quantity === Number.NaN)
				return res({
					status: 400,
					message: 'Invalid quantity provided.',
				});
			if (!data.location)
				return res({ status: 400, message: 'Could not validate location.' });
			if (!data.product)
				return res({
					status: 400,
					message: 'Could not validate product.',
				});

			const newItem = await db.item
				.create({
					data: {
						productId: data.product,
						quantity: data.quantity,
						expires: data.date,
					},
				})
				.catch((err: any) => {
					return res({
						status: 500,
						message:
							'Could not complete request due to a database error. ' + err,
					});
				});

			revalidatePath(`/inventory/${data.location}/${data.product}`);
			res({ status: 200, message: 'Item added.' });
		}
	);

	return payload;
}

export async function deleteItem(id: string, userId?: string) {
	const payload: { status: number; message: string } = await new Promise(
		async (res, rej) => {
			if (!userId)
				return res({
					status: 401,
					message: 'Could not authorize the request.',
				});

			const item = await db.item.findUnique({
				where: { id },
				include: {
					product: {
						include: {
							location: {
								include: {
									user: true,
								},
							},
						},
					},
				},
			});

			if (!item)
				return res({
					status: 404,
					message: 'Could not find the item you are trying to delete.',
				});

			if (item.product.location.user.id !== userId) {
				return res({
					status: 401,
					message: 'Could not authorize the request.',
				});
			}

			await db.item.delete({
				where: { id },
			});

			revalidatePath(`/inventory/${id}`);
			res({ status: 200, message: 'Item deleted.' });
		}
	);

	return payload;
}

export async function editItem(data: FormData, userId?: string) {
	const payload: { status: number; message: string } = await new Promise(
		async (res, rej) => {
			if (!userId)
				return res({
					status: 401,
					message: 'Could not authorize the request.',
				});

			const id = data.get('item-id') as string;
			const exp = new Date(data.get('item-exp') as string);
			const onOrder = data.get('item-onOrder') as string;
			console.log(onOrder);

			if (!id || !exp)
				return res({
					status: 400,
					message: 'Invalid data provided.',
				});

			const item = await db.item.findUnique({
				where: { id },
				include: {
					product: {
						include: {
							location: {
								include: {
									user: true,
								},
							},
						},
					},
				},
			});

			if (!item)
				return res({
					status: 404,
					message: 'Could not find item with that ID.',
				});

			const updated = await db.item
				.update({
					where: {
						id,
					},
					data: {
						expires: exp,
						onOrder: onOrder === 'on',
					},
				})
				.catch((err: any) => {
					console.log(err);
					return res({
						status: 500,
						message: 'Could not complete request due to a database error.',
					});
				});

			revalidatePath(`/inventory/${id}`);
			res({ status: 200, message: 'Item updated.' });
		}
	);

	return payload;
}
