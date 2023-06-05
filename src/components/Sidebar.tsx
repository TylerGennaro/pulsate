import Header from '@components/ui/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { authOptions } from '@lib/auth';
import { db } from '@lib/prisma';
import { getServerSession } from 'next-auth';
import { isExpiring } from '@lib/date';
import { Tag } from '@lib/enum';
import { Nav } from './Nav';

async function getLocations(id: string | undefined) {
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

	// console.dir(locations, { depth: Infinity });

	return locations;
}

export default async function SideNav() {
	const session = await getServerSession(authOptions);
	const locations = await getLocations(session?.user?.id);
	return (
		<div className='w-96 max-w-xs h-full bg-foreground border-r shadow-lg flex flex-col justify-between'>
			<div className='px-8 py-4 flex flex-col gap-8 w-full'>
				<div>
					<Header size='md' className='mt-4'>
						Pulsate
					</Header>
				</div>
				<hr />
				<Nav locations={locations} />
			</div>
			<div className='hover:bg-muted cursor-pointer py-2 px-8 flex gap-4 items-center'>
				<Avatar>
					<AvatarImage src={session?.user?.image || undefined} />
					<AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
				</Avatar>
				<span className='font-semibold text-sm'>{session?.user?.name}</span>
			</div>
		</div>
	);
}
