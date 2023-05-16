'use server';

import { db } from '@lib/prisma';
import { revalidatePath } from 'next/cache';

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

			revalidatePath(`/inventory`);
			res({ status: 200, message: 'Location added.' });
		}
	);

	return payload;
}

export async function deleteLocation(id: string, userId?: string) {
	const payload: { status: number; message: string } = await new Promise(
		async (res, rej) => {
			if (!userId)
				return res({
					status: 401,
					message: 'Could not authorize the request.',
				});

			const location = await db.location.findFirst({
				where: {
					id,
					userId,
				},
			});

			if (!location)
				return res({
					status: 404,
					message: 'Could not find location with that ID.',
				});

			const deleted = await db.location
				.delete({
					where: {
						id,
					},
				})
				.catch((err: any) => {
					console.log(err);
					return res({
						status: 500,
						message: 'Could not complete request due to a database error.',
					});
				});

			res({ status: 200, message: 'Location deleted.' });
		}
	);

	return payload;
}

export async function revalidateLocations() {
	revalidatePath(`/inventory`);
}
