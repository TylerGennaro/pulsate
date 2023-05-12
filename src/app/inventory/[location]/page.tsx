import { Product } from '@app/inventory/[location]/columns';
import InventoryTable from './InventoryTable';
import { Button } from '@components/ui/button';
import { ChevronLeft, Plus } from 'lucide-react';
import NewItemSheet from './NewItemSheet';
import Link from 'next/link';
import Header from '@components/ui/Header';
import { db } from '@lib/prisma';

async function getData(
	location: string
): Promise<{ products: Product[]; location: string }> {
	const data = await db.product.findMany({
		include: {
			location: true,
		},
		where: {
			locationId: location,
		},
	});
	const locationName = await db.location.findFirst({
		select: {
			name: true,
		},
		where: {
			id: location,
		},
	});
	return { products: data, location: locationName.name };
	// return [
	// 	{
	// 		location: 'station-154',
	// 		uid: 'cervical-collar',
	// 		name: 'Cervical Collar',
	// 		quantity: 10,
	// 	},
	// 	{
	// 		location: 'station-154',
	// 		uid: 'vomit-bag',
	// 		name: 'Vomit Bag',
	// 		quantity: 5,
	// 		exp: '5/04/2023',
	// 		tags: ['low', 'expired'],
	// 	},
	// 	{
	// 		location: 'station-154',
	// 		uid: 'triangular-bandage',
	// 		name: 'Triangular Bandage',
	// 		quantity: 12,
	// 		exp: '3/22/2023',
	// 		tags: ['expired'],
	// 	},
	// 	{
	// 		location: 'station-154',
	// 		uid: 'roller-gauze',
	// 		name: 'Roller Gauze',
	// 		quantity: 18,
	// 		exp: '6/10/2023',
	// 	},
	// ];
}

export default async function Inventory({
	params,
}: {
	params: { location: string };
}) {
	const data = await getData(params.location);

	return (
		<>
			<div className='container py-8 flex flex-col gap-4'>
				<Link href='/inventory' className='w-fit mb-4'>
					<Button
						variant='ghost'
						className='p-0 hover:bg-background hover:text-muted-foreground'
					>
						<ChevronLeft className='w-4 h-4 mr-2' />
						Locations
					</Button>
				</Link>
				<div className='flex justify-between items-center flex-wrap'>
					<Header className='mb-4'>{data.location}</Header>
					<NewItemSheet location={params.location} />
				</div>
				<InventoryTable data={data.products} />
			</div>
		</>
	);
}
