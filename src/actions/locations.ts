'use server';

import { db } from '@lib/prisma';
import { ActionResponse, getErrorMessage } from '@lib/utils';
import { revalidatePath } from 'next/cache';

export async function updateLocationName(locationId: string, newName: string) {
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
