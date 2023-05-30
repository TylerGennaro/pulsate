// 'use server';

import { db } from '@lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addProduct(fields: FormData, userId?: string) {
	const payload: { status: number; message: string } = await new Promise(
		async (res, rej) => {
			if (!userId)
				return res({
					status: 401,
					message: 'Could not authorize the request.',
				});
			const data = {
				name: fields.get('name') as string,
				minQuantity: fields.get('min-quantity') as string,
				maxQuantity: fields.get('max-quantity') as string,
				package: fields.get('package') as string,
				location: fields.get('location') as string,
			};

			if (!data.name)
				return res({ status: 400, message: 'Invalid name provided.' });
			if (!data.minQuantity)
				return res({
					status: 400,
					message: 'Invalid minimum quantity provided.',
				});
			if (!data.package)
				return res({ status: 400, message: 'Invalid package provided.' });
			if (data.name.match(/[^a-zA-Z0-9\s-']/g))
				return res({
					status: 400,
					message: 'Name contains illegal characters.',
				});
			if (!parseInt(data.minQuantity))
				return res({
					status: 400,
					message: 'Minimum quantity must be a number.',
				});
			if (data.maxQuantity && !parseInt(data.maxQuantity))
				return res({
					status: 400,
					message: 'Maximum quantity must be a number.',
				});

			const newProduct = await db.product
				.create({
					data: {
						name: data.name,
						package: data.package,
						min: parseInt(data.minQuantity),
						max: parseInt(data.maxQuantity) || null,
						locationId: data.location,
					},
				})
				.catch((err: any) => {
					return res({
						status: 500,
						message:
							'Could not complete request due to a database error. ' + err,
					});
				});

			revalidatePath(`/inventory/${newProduct?.id}`);
			res({ status: 200, message: 'Product added.' });
		}
	);

	return payload;
}

export async function deleteProduct(id: string, userId?: string) {
	console.log('made it');
	const payload: { status: number; message: string } = await new Promise(
		async (res, rej) => {
			if (!userId)
				return res({
					status: 401,
					message: 'Could not authorize the request.',
				});

			const product = await db.product.findUnique({
				where: { id },
				include: {
					location: {
						include: {
							user: true,
						},
					},
				},
			});

			if (!product)
				return res({
					status: 404,
					message: 'Could not find the product you are trying to delete.',
				});

			if (product.location.user.id !== userId) {
				return res({
					status: 401,
					message: 'Could not authorize the request.',
				});
			}

			await db.product.delete({
				where: { id },
			});

			revalidatePath(`/inventory/${id}`);
			res({ status: 200, message: 'Product deleted.' });
		}
	);

	return payload;
}

export async function editProduct(data: FormData, userId?: string) {
	const payload: { status: number; message: string } = await new Promise(
		async (res, rej) => {
			if (!userId)
				return res({
					status: 401,
					message: 'Could not authorize the request.',
				});

			const id = data.get('product-id') as string;
			const name = data.get('product-name') as string;

			if (!id || !name)
				return res({
					status: 400,
					message: 'Invalid data provided.',
				});

			if (name.match(/[^a-zA-Z0-9\s-']/g))
				return res({
					status: 400,
					message: 'Name contains illegal characters.',
				});

			const product = await db.product.findFirst({
				where: {
					id,
					location: {
						userId,
					},
				},
			});

			if (!product)
				return res({
					status: 404,
					message: 'Could not find product with that ID.',
				});

			const updated = await db.product
				.update({
					where: {
						id,
					},
					data: {
						name,
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
			res({ status: 200, message: 'Product updated.' });
		}
	);

	return payload;
}
