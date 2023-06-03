import { authOptions } from '@lib/auth';
import { db } from '@lib/prisma';
import { catchError } from '@lib/utils';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
	name: z
		.string()
		.min(1, { message: 'Name must be at least 2 character long.' })
		.max(50, { message: 'Name must be at most 50 characters long.' })
		.regex(/^[a-z0-9]+[a-z0-9\s-]*$/i, {
			// Contains alphanumerical, \s, -, but can not start with - or \s
			message: 'Name contains illegal characters.',
		}),
	min: z.coerce.number().int().min(1),
	max: z.coerce
		.number({ invalid_type_error: 'Max quantity is not a number.' })
		.int()
		.min(0),
	packageType: z.enum(['single', 'pack', 'box', 'case']),
});

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id)
		return new NextResponse('Unauthorized', { status: 401 });

	const data = await req.json();
	if (!data.locationId)
		return new NextResponse('Invalid location ID.', { status: 400 });

	try {
		const { name, min, max, packageType } = schema.parse(data);

		const newProduct = await db.product.create({
			data: {
				name,
				min,
				max,
				package: packageType,
				locationId: data.locationId,
			},
		});
		return new NextResponse('Product created.', {
			status: 200,
		});
	} catch (e) {
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
		const { name, min, max, packageType } = schema.parse(data);
		const product = await db.product.findFirst({
			where: {
				id,
			},
		});
		if (!product)
			return new NextResponse('Could not find product.', { status: 404 });
		const updatedProduct = await db.product.update({
			where: {
				id,
			},
			data: {
				name,
				min,
				max,
				package: packageType,
			},
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
		const deletedProduct = await db.product.delete({
			where: {
				id,
			},
		});
		return new NextResponse('Product deleted.', { status: 200 });
	} catch (e) {
		return catchError(e);
	}
}
