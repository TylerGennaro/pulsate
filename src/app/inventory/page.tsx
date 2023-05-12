import { db } from '@lib/prisma';
import LocationCard from './LocationCard';
import NewLocationDialog from './NewLocationDialog';
import { getServerSession } from 'next-auth';

export interface Location {
	id: string;
	name: string;
	hasLow: boolean;
	hasExpired?: boolean;
}

async function getData(id: string): Promise<Location[]> {
	const data: Location[] = await db.location.findMany({
		where: {
			userId: id,
		},
	});

	data.forEach(async (location) => {
		const hasLow = await db.item.groupBy({
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
		location.hasLow = hasLow.length > 0;
	});

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
