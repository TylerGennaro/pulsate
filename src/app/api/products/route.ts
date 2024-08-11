import { authOptions } from '@lib/auth';
import { PRODUCT_ID_LENGTH } from '@lib/constants';
import { Tag } from '@lib/enum';
import { log } from '@lib/log';
import { db } from '@lib/prisma';
import { catchError, formDataToObject, parseProductInfo } from '@lib/utils';
import { LogType, Product } from '@prisma/client';
import { nanoid } from 'nanoid';
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
		.max(50, { message: 'Name must be less than 50 characters.' })
		.nullable(),
	url: z.string().url({ message: 'URL is not valid.' }).nullable(),
});

export async function GET(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id)
		return new NextResponse('Unauthorized', { status: 401 });

	const { searchParams } = new URL(req.url);
	const locationId = searchParams.get('location') || '';
	if (!locationId)
		return new NextResponse('Invalid location ID.', { status: 400 });

	try {
		const products = await db.product.findMany({
			include: {
				location: true,
				items: true,
			},
			where: {
				locationId,
			},
			orderBy: {
				position: { sort: 'asc', nulls: 'last' },
			},
		});
		const productListings: ProductListing[] = products.map((product) => {
			const productInfo = parseProductInfo(product);
			return {
				...product,
				tags: productInfo.tags,
				exp: productInfo.exp,
				quantity: productInfo.quantity,
			};
		});
		return NextResponse.json(productListings, { status: 200 });
	} catch (e) {
		console.error(e);
		return catchError(e);
	}
}

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id)
		return new NextResponse('Unauthorized', { status: 401 });

	const { searchParams } = new URL(req.url);
	const locationId = searchParams.get('location') || '';
	if (!locationId)
		return new NextResponse('Invalid location ID.', { status: 400 });

	const data = formDataToObject(await req.formData());
	try {
		const parseData = schema.parse(data);
		await db.product.create({
			data: {
				id: nanoid(PRODUCT_ID_LENGTH),
				name: parseData.name,
				min: parseData.min ?? 0,
				package: parseData.packageType,
				position: parseData.position,
				locationId,
				url: parseData.url,
			},
		});
		// log(LogType.PRODUCT_ADD, {
		// 	product: newProduct.id,
		// });
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
	const id = searchParams.get('id') || '';

	const data = formDataToObject(await req.formData());
	try {
		const { name, min, packageType, position, url } = schema.parse(data);
		const product = await db.product.findFirst({
			where: {
				id,
			},
		});
		if (!product)
			return new NextResponse('Could not find product.', { status: 404 });

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
		// log(LogType.PRODUCT_UPDATE, {
		// 	product: updatedProduct.id,
		// 	footnote: [
		// 		...(product.name !== updatedProduct.name
		// 			? [`Name: ${product.name} → ${updatedProduct.name}`]
		// 			: []),
		// 		...(product.min !== updatedProduct.min
		// 			? [`Min: ${product.min} → ${updatedProduct.min}`]
		// 			: []),
		// 		...(product.max !== updatedProduct.max
		// 			? [`Max: ${product.max} → ${updatedProduct.max}`]
		// 			: []),
		// 		...(product.package !== updatedProduct.package
		// 			? [`Package: ${product.package} → ${updatedProduct.package}`]
		// 			: []),
		// 		...(product.position !== updatedProduct.position
		// 			? [
		// 					`Position: ${product.position || 'None'} → ${
		// 						updatedProduct.position || 'None'
		// 					}`,
		// 			  ]
		// 			: []),
		// 	].join(', '),
		// });
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

		await db.product.delete({
			where: {
				id,
			},
		});

		const url = new URL(req.url);
		url.pathname = '/app/' + product.locationId;
		url.search = '';
		return NextResponse.redirect(url.toString());
	} catch (e) {
		return catchError(e);
	}
}
