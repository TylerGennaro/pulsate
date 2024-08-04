'use server';

import { authOptions } from '@lib/auth';
import { db } from '@lib/prisma';
import { ActionResponse } from '@lib/utils';
import { ShareStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

export async function sendLocationShareInvitation(
	email: string,
	locationId: string
) {
	const session = await getServerSession(authOptions);
	if (!session) return ActionResponse.send(false, 'Unauthorized');

	if (session.user.email === email)
		return ActionResponse.send(
			false,
			'You cannot share a location with yourself'
		);

	// See if the email exists
	const user = await db.user.findFirst({
		where: {
			email,
		},
	});
	// If the user doesn't exist, don't send an error. This is to prevent users from knowing if an email exists in the system.

	// Add the invitation to db if the user exists
	if (user) {
		await db.locationShare.create({
			data: {
				locationId,
				userId: user.id,
				status: ShareStatus.PENDING,
			},
		});
	}

	// Refetch the location settings page
	revalidatePath(`/app/${locationId}/settings`);

	return ActionResponse.send(true);
}
