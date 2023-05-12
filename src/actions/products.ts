'use server';

import { db } from '@lib/prisma';

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

			res({ status: 200, message: 'Product added.' });
		}
	);

	return payload;
}
