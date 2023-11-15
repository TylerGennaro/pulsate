import { authOptions } from '@lib/auth';
import { log } from '@lib/log';
import { db } from '@lib/prisma';
import { catchError } from '@lib/utils';
import { LogType } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
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
		.number()
		.int()
		.min(1, { message: 'Minimum quantity must be greater than 1.' }),
	max: z.coerce
		.number({ invalid_type_error: 'Max quantity is not a number.' })
		.int()
		.min(0, { message: 'Maximum quantity must be greater than 0.' })
		.nullable(),
	packageType: z.enum(['single', 'pack', 'box', 'case'], {
		invalid_type_error: 'Package type is not valid.',
		required_error: 'Package type is required.',
	}),
	position: z
		.string()
		.max(50, { message: 'Name must be less than 50 characters.' })
		.nullable(),
	url: z.string().url({ message: 'URL is not valid.' }).nullable(),
});

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id)
		return new NextResponse('Unauthorized', { status: 401 });

	const data = await req.json();
	if (!data.locationId)
		return new NextResponse('Invalid location ID.', { status: 400 });

	try {
		const { name, min, max, packageType, position, url } = schema.parse(data);

		// const tinyUrl = url ? await shortenURL(url) : null;

		const newProduct = await db.product.create({
			data: {
				name,
				min,
				max: max ?? undefined,
				package: packageType,
				position,
				locationId: data.locationId,
				url,
			},
		});
		log(LogType.PRODUCT_ADD, {
			product: newProduct.id,
		});
		return new NextResponse('Product created.', {
			status: 200,
		});
	} catch (e) {
		console.log(e);
		return catchError(e);
	}
}

export async function PUT(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id)
		return new NextResponse('Unauthorized', { status: 401 });

	const { searchParams } = new URL(req.url);
	const data = await req.json();
	const id = searchParams.get('id') || '';

	try {
		const { name, min, max, packageType, position, url } = schema.parse(data);
		const product = await db.product.findFirst({
			where: {
				id,
			},
		});
		if (!product)
			return new NextResponse('Could not find product.', { status: 404 });

		// let shortUrl: number | null = null;
		// if (url) {
		// 	if (product.url) {
		// 		const matchingURL = await db.product.findMany({
		// 			where: {
		// 				url: product.url,
		// 			},
		// 		});
		// 		if (matchingURL.length > 1) {
		// 			const newUrl = await shortenURL(url);
		// 			shortUrl = newUrl;
		// 		} else {
		// 			console.log('updating to ' + url);
		// 			console.log(await updateShortURL(product.url, url));
		// 			shortUrl = product.url;
		// 		}
		// 	} else {
		// 		shortUrl = await shortenURL(url);
		// 	}
		// } else {
		// 	if (product.url) {
		// 		await deleteShortUrl(product.url);
		// 	}
		// }

		const updatedProduct = await db.product.update({
			where: {
				id,
			},
			data: {
				name,
				min,
				max: max ?? undefined,
				package: packageType,
				position,
				url,
			},
		});
		log(LogType.PRODUCT_UPDATE, {
			product: updatedProduct.id,
			footnote: [
				...(product.name !== updatedProduct.name
					? [`Name: ${product.name} → ${updatedProduct.name}`]
					: []),
				...(product.min !== updatedProduct.min
					? [`Min: ${product.min} → ${updatedProduct.min}`]
					: []),
				...(product.max !== updatedProduct.max
					? [`Max: ${product.max} → ${updatedProduct.max}`]
					: []),
				...(product.package !== updatedProduct.package
					? [`Package: ${product.package} → ${updatedProduct.package}`]
					: []),
				...(product.position !== updatedProduct.position
					? [
							`Position: ${product.position || 'None'} → ${
								updatedProduct.position || 'None'
							}`,
					  ]
					: []),
			].join(', '),
		});
		return new NextResponse('Product updated.', { status: 200 });
	} catch (e) {
		return catchError(e);
	}
}

export async function DELETE(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id)
		return new NextResponse('Unauthorized', { status: 401 });

	const { searchParams } = new URL(req.url);
	const userId = session?.user.id;
	const id = searchParams.get('id') || '';

	try {
		const product = await db.product.findFirst({
			where: {
				id,
				location: {
					userId,
				},
			},
		});
		if (!product)
			return new NextResponse('Could not find product.', { status: 404 });

		// if (product.url) {
		// 	await deleteShortUrl(product.url);
		// }

		const deletedProduct = await db.product.delete({
			where: {
				id,
			},
		});
		log(LogType.PRODUCT_REMOVE, {
			product: deletedProduct.id,
		});
		return new NextResponse('Product deleted.', { status: 200 });
	} catch (e) {
		return catchError(e);
	}
}
