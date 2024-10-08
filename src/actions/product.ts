'use server';

import { authOptions } from '@lib/auth';
import { db } from '@lib/prisma';
import { ActionResponse, getErrorMessage } from '@lib/utils';
import { Product } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const schema = z.object({
	name: z
		.string()
		.min(1, { message: 'Name must be at least 2 characters.' })
		.max(50, { message: 'Name must be less than 50 characters.' })
		.regex(/^[a-z0-9]+[a-z0-9\s-]*$/i, {
			// Contains alphanumerical, \s, -, but can not start with - or \s
			message: 'Name contains illegal characters.',
		}),
	min: z.coerce
		.number({ invalid_type_error: 'Min quantity is not a number.' })
		.int({ message: 'Min quantity is not an integer.' })
		.min(1, { message: 'Minimum quantity must be greater than 1.' })
		.nullable(),
	packageType: z.enum(['single', 'pack', 'box', 'case'], {
		invalid_type_error: 'Package type is not valid.',
		required_error: 'Package type is required.',
	}),
	position: z
		.string()
		.max(50, { message: 'Position must be less than 50 characters.' })
		.nullable(),
	url: z.string().url({ message: 'URL is not valid.' }).nullable(),
});

export async function editProduct(id: string, data: Partial<Product>) {
	const session = await getServerSession(authOptions);
	if (!session) return ActionResponse.send(false, 'Unauthorized');

	try {
		const { name, min, packageType, position, url } = schema.parse(data);
		await db.product.update({
			where: {
				id,
			},
			data: {
				name,
				min: min ?? 0,
				package: packageType,
				position,
				url,
			},
		});

		revalidatePath('/app/[location]/' + id, 'page');
		return ActionResponse.send(true);
	} catch (error) {
		return ActionResponse.send(false, getErrorMessage(error));
	}
}
