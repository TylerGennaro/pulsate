import { authOptions } from '@lib/auth';
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

	if (single === 'true')
		return NextResponse.json(
			{ locations: locations[0] },
			{
				status: locations[0] ? 200 : 404,
			}
		);
	else
		return NextResponse.json(
			{ locations },
			{
				status: 200,
			}
		);
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
