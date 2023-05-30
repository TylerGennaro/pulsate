import { authOptions } from '@lib/auth';
import { db } from '@lib/prisma';
import { catchError } from '@lib/utils';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
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
	id: z.string().cuid(),
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

		revalidatePath(`/inventory`);
		return new NextResponse('Location added', {
			status: 200,
		});
	} catch (e) {
		return catchError(e);
	}
}
