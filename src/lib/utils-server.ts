import { revalidateTag } from 'next/cache';
import { db } from './prisma';
import { fetchJSON } from './utils';

export async function notify(options: {
	userId: string;
	message: string;
	redirect?: string;
}) {
	const notif = await db.notification.findFirst({
		where: {
			userId: options.userId,
			message: options.message,
			created: {
				gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days
			},
		},
	});
	if (notif) return;
	await db.notification.create({
		data: {
			userId: options.userId,
			message: options.message,
			redirect: options.redirect,
		},
	});
	revalidateTag('notifications');
}

export function fetchServer(url: string, options?: RequestInit) {
	return fetch(process.env.NEXTAUTH_URL + url, options);
}
