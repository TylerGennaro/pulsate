import { revalidateTag } from 'next/cache';
import { db } from './prisma';

export async function notify(options: {
	userId: string;
	message: string;
	redirect?: string;
}) {
	const notif = await db.notification.create({
		data: {
			userId: options.userId,
			message: options.message,
			redirect: options.redirect,
		},
	});
	revalidateTag('notifications');
}
