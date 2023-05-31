import { authOptions } from '@lib/auth';
import { db } from '@lib/prisma';
import { catchError } from '@lib/utils';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
	userId: z.string().cuid(),
	name: z
		.string()
		.min(1, { message: 'Name must be at least 2 character long.' })
		.max(50, { message: 'Name must be at most 50 characters long.' })
		.regex(/^[a-z0-9]+[a-z0-9\s-]*$/i, {
			// Contains alphanumerical, \s, -, but can not start with - or \s
			message: 'Name contains illegal characters.',
		})
		.optional(),
	min: z.coerce.number().int().min(1),
	max: z.coerce
		.number({ invalid_type_error: 'Max quantity is not a number.' })
		.int()
		.min(0),
	packageType: z.enum(['single', 'pack', 'box', 'case']),
	locationId: z.string().cuid(),
	id: z.string().cuid().optional(),
});

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session || !session?.user?.id)
		return new NextResponse('Unauthorized', { status: 401 });

	const data = await req.json();
	data.userId = session?.user.id;

	try {
		const { name, min, max, packageType, locationId } = schema.parse(data);
		if (!name) return new NextResponse('Invalid name', { status: 400 });

		const newProduct = await db.product.create({
			data: {
				name,
				min,
				max,
				package: packageType,
				locationId,
			},
		});
	} catch (e) {
		return catchError(e);
	} finally {
		revalidatePath(`/inventory/${data.locationId}`);
		return new NextResponse('Product created.', {
			status: 200,
		});
	}
}

export async function PUT(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session || !session?.user?.id)
		return new NextResponse('Unauthorized', { status: 401 });

	const { searchParams } = new URL(req.url);
	const data = await req.json();
	data.userId = session?.user.id;
	data.id = searchParams.get('id');

	try {
		const { name, min, max, packageType, id, userId } = schema.parse(data);
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
	} catch (e) {
		return catchError(e);
	} finally {
		revalidatePath(`/inventory/${data.id}`);
		return new NextResponse('Product updated.', { status: 200 });
	}
}

export async function DELETE(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session || !session?.user?.id)
		return new NextResponse('Unauthorized', { status: 401 });

	const { searchParams } = new URL(req.url);
	const data = {
		userId: session?.user.id,
		id: searchParams.get('id'),
	};

	try {
		const { id, userId } = schema.parse(data);
		const location = await db.location.findFirst({
			where: {
				id,
				userId,
			},
		});
		if (!location)
			return new NextResponse('Could not find location.', { status: 404 });
		const deletedLocation = await db.location.delete({
			where: {
				id,
			},
		});
	} catch (e) {
		return catchError(e);
	} finally {
		revalidatePath('/inventory');
		redirect('/inventory');
	}
}
