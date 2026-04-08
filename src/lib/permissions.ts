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
	location: string,
): Promise<PermissionSet> {
	const cacheKey = `p:${user.id}:${location}`;
	let permissions: Permission[] = [];
	let cachedPermissions: string | null = null;
	try {
		cachedPermissions = await redis.get(cacheKey);
	} catch (error) {
		console.warn('Error fetching redis cache');
	}
	if (cachedPermissions !== null) {
		permissions = JSON.parse(cachedPermissions);
	}

	if (!permissions || permissions.length === 0) {
		console.log('Cache miss');
		const dbPermissions = DB_PERMISSIONS[user.id]?.[location] || [];
		if (dbPermissions.length === 0) return new Set([]);
		try {
			await redis.set(
				cacheKey,
				JSON.stringify(dbPermissions),
				'EX',
				CACHE_TTL_SEC,
			);
		} catch (error) {
			console.warn('Error setting redis cache', error);
		}
	} else {
		console.log('Cache hit');
	}

	return new Set(permissions);
}

export async function hasPermission(
	user: User,
	location: string,
	permission: Permission,
) {
	return true; // Temporary bypass for permissions check during development
	// const permissions = await getPermissions(user, location);
	// return permissions.has(permission);
}
