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

export async function shortenURL(url: string) {
	const response = await fetchJSON(
		'https://publ.cc/api/url/add',
		'POST',
		{
			url,
		},
		{
			Authorization: `Bearer ${process.env.PUBLCC_API_KEY}`,
		}
	);
	return parseInt(response.data.id);
}

export async function getLongURL(id: number) {
	const response = await fetchJSON(
		`https://publ.cc/api/url/${id}`,
		'GET',
		{},
		{
			Authorization: `Bearer ${process.env.PUBLCC_API_KEY}`,
		}
	);
	return response.data.details.longurl;
}

export function updateShortURL(id: number, newUrl: string) {
	return fetchJSON(
		`https://publ.cc/api/url/${id}/update`,
		'PUT',
		{
			url: newUrl,
		},
		{
			Authorization: `Bearer ${process.env.PUBLCC_API_KEY}`,
		}
	);
}

export function deleteShortUrl(id: number) {
	if (id === null) return;
	return fetchJSON(
		`https://publ.cc/api/url/${id}/delete`,
		'DELETE',
		{},
		{
			Authorization: `Bearer ${process.env.PUBLCC_API_KEY}`,
		}
	);
}
