import { LogType } from '@prisma/client';
import { db } from './prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export async function log(
	type: LogType,
	data: {
		product: string;
		quantity?: number;
		footnote?: string;
	}
) {
	const session = await getServerSession(authOptions);
	const result = await db.log.create({
		data: {
			type,
			userId: session?.user.id,
			productId: data.product,
			quantity: data.quantity,
			footnote: data.footnote,
		},
	});
	return result;
}
