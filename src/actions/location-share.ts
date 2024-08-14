'use server';

import { authOptions } from '@lib/auth';
import { db } from '@lib/prisma';
import { ActionResponse, getErrorMessage } from '@lib/utils';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { ShareStatus } from '@prisma/client';

const schema = z.object({
	email: z.string().email(),
});

export async function sendLocationShareInvitation(
	email: string,
	locationId: string
) {
	const session = await getServerSession(authOptions);
	if (!session) return ActionResponse.send(false, 'Unauthorized');

	if (session.user.email === email)
		return ActionResponse.send(
			false,
			'You cannot share a location with yourself.'
		);

	try {
		schema.parse({ email });
	} catch (error) {
		return ActionResponse.send(false, getErrorMessage(error));
	}

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

		// Refetch the location settings page
		revalidatePath(`/app/${locationId}/settings`);
	}

	return ActionResponse.send(true);
}
