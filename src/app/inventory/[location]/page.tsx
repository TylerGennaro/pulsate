import { Item } from '@app/inventory/[location]/columns';
import InventoryTable from './InventoryTable';
import { Button } from '@components/ui/button';
import { ChevronLeft, Plus } from 'lucide-react';
import NewItemSheet from './NewItemSheet';
import Link from 'next/link';

async function getData(): Promise<Item[]> {
	return [
		{
			location: 'station-154',
			uid: 'cervical-collar',
			name: 'Cervical Collar',
			quantity: 10,
		},
		{
			location: 'station-154',
			uid: 'vomit-bag',
			name: 'Vomit Bag',
			quantity: 5,
		},
		{
			location: 'station-154',
			uid: 'triangular-bandage',
			name: 'Triangular Bandage',
			quantity: 12,
		},
		{
			location: 'station-154',
			uid: 'roller-gauze',
			name: 'Roller Gauze',
			quantity: 18,
		},
	];
}

export default async function Inventory() {
	const data = await getData();

	return (
		<>
			<div className='container pt-12 flex flex-col gap-4'>
				<Link href='/inventory' className='w-fit mb-4'>
					<Button
						variant='ghost'
						className='p-0 hover:bg-background hover:text-muted-foreground'
					>
						<ChevronLeft className='w-4 h-4 mr-2' />
						Locations
					</Button>
				</Link>
				<InventoryTable data={data} />
			</div>
			<NewItemSheet />
		</>
	);
}
