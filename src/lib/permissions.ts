import { User } from 'next-auth';
import redis from './redis-client';

const CACHE_TTL_SEC = 300;

const DB_PERMISSIONS: {
	[key: string]: {
		[key: string]: Permission[];
	};
} = {
	YGlYC2c6NnUSGj: {
		'0OmiXn9BuTEVKj': ['location.edit', 'product.edit', 'product.create'],
	},
};

export async function getPermissions(
	user: User,
	location: string
): Promise<PermissionSet> {
	const cacheKey = `p:${user.id}:${location}`;
	let permissions: string | null = null;
	try {
		permissions = await redis.get<string>(cacheKey);
	} catch (error) {
		console.warn('Error fetching redis cache');
	}
	if (permissions !== null) {
		permissions = JSON.parse(permissions);
	}

	if (!permissions) {
		console.log('Cache miss');
		const dbPermissions = DB_PERMISSIONS[user.id]?.[location] || [];
		if (dbPermissions.length === 0) return new Set([]);
		permissions = JSON.stringify(dbPermissions);
		console.log(cacheKey, permissions);
		try {
			await redis.set(cacheKey, permissions, { ex: CACHE_TTL_SEC });
		} catch (error) {
			console.warn('Error setting redis cache');
		}
	} else {
		console.log('Cache hit');
	}

	return new Set(JSON.parse(permissions) as Permission[]);
}

export async function hasPermission(
	user: User,
	location: string,
	permission: Permission
) {
	const permissions = await getPermissions(user, location);
	return permissions.has(permission);
}
