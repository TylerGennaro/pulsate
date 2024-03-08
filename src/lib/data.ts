import { db } from './prisma';

export async function fetchLocationInfo(id: string) {
	const data = await db.location.findFirst({
		select: {
			name: true,
			userId: true,
		},
		where: {
			id,
		},
	});
	return { name: data?.name, userId: data?.userId };
}
