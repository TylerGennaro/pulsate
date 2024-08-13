'use server';

import { authOptions } from '@lib/auth';
import { db } from '@lib/prisma';
import { ActionResponse, getErrorMessage } from '@lib/utils';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

export async function updateLocationName(locationId: string, newName: string) {
	const session = await getServerSession(authOptions);
	if (!session) return ActionResponse.send(false, 'Unauthorized');

	try {
		await db.location.update({
			where: {
				id: locationId,
			},
			data: {
				name: newName,
			},
		});
		revalidatePath(`/app/${locationId}`);
		return ActionResponse.send(true);
	} catch (error) {
		return ActionResponse.send(false, getErrorMessage(error));
	}
}
