import { authOptions } from '@lib/auth';
import { db } from '@lib/prisma';
import { catchError } from '@lib/utils';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
	userId: z.string().cuid(),
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

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session || !session?.user?.id)
		return new NextResponse('Unauthorized', { status: 401 });

	const data = await req.json();
	data.userId = session?.user.id;

	try {
		const { userId, name } = schema.parse(data);
		if (!name) return new NextResponse('Invalid name', { status: 400 });

		const newLocation = await db.location.create({
			data: {
				name,
				userId,
			},
		});

		return new NextResponse('Location added', {
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
	const data = await req.json();
	data.userId = session?.user.id;
	data.id = searchParams.get('id');

	try {
		const { name, id, userId } = schema.parse(data);
		const location = await db.location.findFirst({
			where: {
				id,
				userId,
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
		redirect('/inventory');
	} catch (e) {
		return catchError(e);
	}
}
