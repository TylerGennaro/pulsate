import { db } from '@lib/prisma';
import LocationCard from './LocationCard';
import NewLocationDialog from './NewLocationDialog';
import { getServerSession } from 'next-auth';
import { Metadata } from 'next';
import { isExpiring } from '@lib/date';

export const metadata: Metadata = {
	title: 'Locations | LFHRS Inventory',
	description: 'Manage medical supply inventory for LFHRS.',
};

async function getData(id: string): Promise<LocationInfo[]> {
	const data: LocationInfo[] = await db.location.findMany({
		where: {
			userId: id,
		},
		select: {
			id: true,
			name: true,
			userId: true,
			products: true,
			user: true,
		},
	});

	await Promise.all([
		...data.map(async (location: LocationInfo) => {
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
			location.hasLow = hasLow.length > 0 || hasNone.length > 0;
			for (const item of exp) {
				if (isExpiring(item.expires)) {
					location.hasExpired = true;
					break;
				}
			}
		}),
	]);

	// console.dir(data, { depth: Infinity });

	return data;
}

export default async function Page() {
	const session = await getServerSession();
	if (!session) return null;
	const data = await getData(session.user?.id);

	return (
		<div className='container py-8'>
			<NewLocationDialog />
			<div className='flex flex-col gap-4'>
				{data.map((location) => (
					<LocationCard location={location} key={location.id} />
				))}
			</div>
		</div>
	);
}

/*

SELECT Item.productId, SUM(Item.quantity) AS total
FROM Item, Product, Location
WHERE Item.productId = Product.id AND Product.locationId = 'cku0q2q2h0000h1tj5q1q2q2h'
GROUP BY Item.productId
HAVING SUM(Item.quantity) < 5

*/
