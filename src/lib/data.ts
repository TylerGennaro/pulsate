import { db } from './prisma';

export async function fetchLocationInfo(id: string) {
	const data = await db.location.findFirst({
		select: {
			name: true,
			user: {
				select: {
					name: true,
					id: true,
				},
			},
		},
		where: {
			id,
		},
	});
	return { name: data?.name, userId: data?.user.id, userName: data?.user.name };
}
