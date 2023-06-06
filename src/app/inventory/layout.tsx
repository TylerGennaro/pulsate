import AppShell from '@components/AppShell';
import { authOptions } from '@lib/auth';
import '@styles/globals.css';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { db } from '@lib/prisma';
import { isExpiring } from '@lib/date';
import { Tag } from '@lib/enum';
import SignIn from '@components/SignIn';

export const metadata: Metadata = {
	title: 'Dashboard | LFHRS Inventory',
	description: 'Manage medical supply inventory for LFHRS.',
};

async function getLocations() {
	const session = await getServerSession(authOptions);
	if (!session) return null;
	const id = session.user.id;
	const locations: LocationInfo[] = await db.location.findMany({
		where: {
			userId: id,
		},
		select: {
			id: true,
			name: true,
			products: true,
			userId: true,
		},
	});

	await Promise.all([
		...locations.map(async (location: LocationInfo) => {
			const hasLowQuery = db.item.groupBy({
				where: {
					product: {
						locationId: location.id,
					},
				},
				by: ['productId'],
				_sum: {
					quantity: true,
				},
				having: {
					quantity: {
						_sum: {
							lt: 5,
						},
					},
				},
			});

			const hasNoneQuery = db.product.findMany({
				where: {
					locationId: location.id,
					items: {
						none: {},
					},
				},
			});

			const expQuery = db.item.findMany({
				where: {
					product: {
						locationId: location.id,
					},
				},
				select: {
					expires: true,
				},
			});

			const [hasLow, hasNone, exp] = await Promise.all([
				hasLowQuery,
				hasNoneQuery,
				expQuery,
			]);
			location.tags = [];
			if (hasLow.length > 0 || hasNone.length > 0) location.tags.push(Tag.LOW);
			for (const item of exp) {
				if (isExpiring(item.expires)) {
					location.tags.push(Tag.EXPIRES);
					break;
				}
			}
		}),
	]);

	return locations;
}

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const locations = await getLocations();
	const session = await getServerSession(authOptions);
	if (!session) return <SignIn />;
	return <AppShell locations={locations}>{children}</AppShell>;
}
