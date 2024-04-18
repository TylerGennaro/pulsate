import { db } from './prisma';

export async function getProduct(
	id: string,
	include: { items: boolean; location: boolean } = {
		items: false,
		location: false,
	}
) {
	const data = await db.product.findFirst({
		where: {
			id,
		},
		include,
	});
	return data;
}

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

const validSettings = ['location.email-checkouts'];

export async function updateSetting(
	location: string,
	key: string,
	value: string | number
) {
	if (!validSettings.includes(key)) return;
	await db.locationSettings.upsert({
		where: { locationId_key: { locationId: location, key } },
		create: {
			locationId: location,
			key,
			value: String(value),
			isNumber: typeof value === 'number',
		},
		update: { value: String(value), isNumber: typeof value === 'number' },
	});
}
