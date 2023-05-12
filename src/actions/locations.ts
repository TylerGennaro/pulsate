'use server';

import { db } from '@lib/prisma';

export async function addLocation(data: FormData, userId?: string) {
	const payload: { status: number; message: string } = await new Promise(
		async (res, rej) => {
			if (!userId)
				return res({
					status: 401,
					message: 'Could not authorize the request.',
				});
			const name = data.get('location-name') as string;

			if (!name) return { status: 400, message: 'Invalid name provided.' };
			if (name.match(/[^a-zA-Z0-9\s-']/g))
				return res({
					status: 400,
					message: 'Name contains illegal characters.',
				});

			const newLocation = await db.location
				.create({
					data: {
						name,
						userId,
					},
				})
				.catch((err: any) => {
					return res({
						status: 500,
						message: 'Could not complete request due to a database error.',
					});
				});

			res({ status: 200, message: 'Location added.' });
		}
	);

	return payload;
}
