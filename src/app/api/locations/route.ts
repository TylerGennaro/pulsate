import { authOptions } from '@lib/auth';
import { isExpired } from '@lib/date';
import { Constants, Tag } from '@lib/enum';
import { db } from '@lib/prisma';
import { catchError, formDataToObject } from '@lib/utils';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
	name: z.optional(
		z
			.string()
			.min(1, { message: 'Name must be at least 2 character long.' })
			.max(50, { message: 'Name must be at most 50 characters long.' })
			.regex(/^[a-z0-9]+[a-z0-9\s-]*$/i, {
				// Contains alphanumerical, \s, -, but can not start with - or \s
				message: 'Name contains illegal characters.',
			})
	),
	id: z.string().cuid().optional(),
});

export async function GET(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session || !session?.user?.id)
		return new NextResponse('Unauthorized', { status: 401 });

	const { searchParams } = new URL(req.url);
	const id = searchParams.get('id');
	const single = searchParams.get('single') ?? false;

	if (single === 'true') {
		const locations = await db.location.findMany({
			where: {
				userId: session.user.id,
				id: id ? { equals: id } : undefined,
			},
			select: {
				id: true,
				name: true,
				user: {
					select: {
						name: true,
					},
				},
			},
		});
		return NextResponse.json(locations[0], {
			status: locations[0] ? 200 : 404,
		});
	} else {
		const locations = await db.location.findMany({
			where: {
				userId: session.user.id,
				id: id ? { equals: id } : undefined,
			},
			select: {
				id: true,
				name: true,
				products: {
					select: {
						items: {
							select: {
								quantity: true,
								expires: true,
							},
						},
						min: true,
					},
				},
			},
		});
		const locationsWithTags = locations.map((location) => {
			const tags: Tag[] = [];
			const hasLow = location.products.some(
				(product) =>
					product.items.reduce((acc, item) => acc + item.quantity, 0) <
					product.min
			);
			const expireStatus = location.products.reduce((acc, product) => {
				const productExpireStatus = product.items.reduce((acc, item) => {
					const getExpiredTag = isExpired(item.expires);
					return Math.min(acc, getExpiredTag);
				}, Infinity);
				return Math.min(acc, productExpireStatus);
			}, Infinity);
			if (hasLow) tags.push(Tag.LOW);
			if (expireStatus === Constants.IS_EXPIRED) tags.push(Tag.EXPIRED);
			else if (expireStatus === Constants.IS_EXPIRING) tags.push(Tag.EXPIRES);
			return {
				...location,
				tags,
			};
		});
		return NextResponse.json(locationsWithTags, {
			status: 200,
		});
	}
}

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session || !session?.user?.id)
		return new NextResponse('Unauthorized', { status: 401 });

	const data = formDataToObject(await req.formData());

	try {
		const { name } = schema.parse(data);
		if (!name) return new NextResponse('Invalid name', { status: 400 });

		const newLocation = await db.location.create({
			data: {
				name,
				userId: session.user.id,
			},
		});

		return new NextResponse(newLocation.id, {
			status: 200,
		});
	} catch (e) {
		return catchError(e);
	}
}

export async function PUT(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session || !session?.user?.id)
		return new NextResponse('Unauthorized', { status: 401 });

	const { searchParams } = new URL(req.url);
	const formData = await req.formData();
	const data = formDataToObject(formData);
	const id = searchParams.get('id');

	if (!id) return new NextResponse('Invalid query parameters', { status: 400 });

	try {
		const { name } = schema.parse(data);
		const location = await db.location.findFirst({
			where: {
				id,
				userId: session.user.id,
			},
		});
		if (!location)
			return new NextResponse('Could not find location.', { status: 404 });
		const updatedLocation = await db.location.update({
			where: {
				id,
			},
			data: {
				name,
			},
		});
		return new NextResponse('Location updated.', { status: 200 });
	} catch (e) {
		return catchError(e);
	}
}

export async function DELETE(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session || !session?.user?.id)
		return new NextResponse('Unauthorized', { status: 401 });

	const { searchParams } = new URL(req.url);
	const id = searchParams.get('id');

	if (!id) return new NextResponse('Invalid query parameters', { status: 400 });

	try {
		const deletedLocation = await db.location.delete({
			where: {
				id,
			},
		});
		if (!deletedLocation.id)
			return new NextResponse('Location not found.', { status: 404 });

		const url = new URL(req.url);
		url.pathname = '/app';
		url.search = '';
		return NextResponse.redirect(url.toString());
	} catch (e) {
		return catchError(e);
	}
}
