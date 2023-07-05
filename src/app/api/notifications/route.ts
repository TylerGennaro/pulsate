import { authOptions } from '@lib/auth';
import { db } from '@lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
	const session = await getServerSession(authOptions);
	if (!session) return new NextResponse('Unauthorized', { status: 401 });
	const notifications = await db.notification.findMany({
		where: { userId: session.user.id },
		orderBy: { created: 'desc' },
	});
	return NextResponse.json(notifications, { status: 200 });
}

export async function PUT(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session) return new NextResponse('Unauthorized', { status: 401 });
	const body = await req.json();
	if (!body.notifications || !body.notifications.length)
		return new NextResponse('Bad Request', { status: 400 });
	try {
		for (const notification of body.notifications as string[]) {
			await db.notification.update({
				where: {
					created: notification,
				},
				data: {
					read: true,
				},
			});
		}
	} catch (err) {
		return new NextResponse('Could not perform database operations', {
			status: 400,
		});
	}
	return NextResponse.json({}, { status: 200 });
}
