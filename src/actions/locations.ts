// 'use server';

import { authOptions } from '@lib/auth';
import { db } from '@lib/prisma';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { toast } from 'react-hot-toast';

export async function addLocation(data: FormData) {
	const payload: { status: number; message: string } = await new Promise(
		async (res, rej) => {
			const session = await getServerSession(authOptions);
			console.log(session);
			console.log(data);
			toast.success('done');
			return res({ status: 200, message: 'Location added.' });
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

export async function editLocation(data: FormData, userId?: string) {
	const payload: { status: number; message: string } = await new Promise(
		async (res, rej) => {
			if (!userId)
				return res({
					status: 401,
					message: 'Could not authorize the request.',
				});

			const id = data.get('location-id') as string;
			const name = data.get('location-name') as string;

			if (!id || !name)
				return res({
					status: 400,
					message: 'Invalid data provided.',
				});

			if (name.match(/[^a-zA-Z0-9\s-']/g))
				return res({
					status: 400,
					message: 'Name contains illegal characters.',
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

			const updated = await db.location
				.update({
					where: {
						id,
					},
					data: {
						name,
					},
				})
				.catch((err: any) => {
					console.log(err);
					return res({
						status: 500,
						message: 'Could not complete request due to a database error.',
					});
				});

			revalidateLocations();
			res({ status: 200, message: 'Location updated.' });
		}
	);

	return payload;
}

export async function revalidateLocations() {
	revalidatePath(`/inventory`);
}
