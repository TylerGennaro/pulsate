import InventoryTable from './InventoryTable';
import { Button } from '@components/ui/button';
import { ChevronLeft } from 'lucide-react';
import NewProduct from './NewProduct';
import Link from 'next/link';
import Header from '@components/ui/Header';
import { db } from '@lib/prisma';
import { Item, Location, Product } from '@prisma/client';
import { Tag } from '@lib/enum';
import { isExpiring } from '@lib/date';
import EditLocation from './EditLocation';
import { Suspense } from 'react';
import TableLoading from './TableLoading';

export async function generateMetadata({
	params,
}: {
	params: { location: string };
}) {
	const name = await getLocationName(params.location);
	return {
		title: `${name} | LFHRS Inventory`,
		description: `Manage medical supply inventory for ${name}.`,
	};
}

async function getLocationName(id: string) {
	const data = await db.location.findFirst({
		select: {
			name: true,
		},
		where: {
			id,
		},
	});
	return data?.name;
}

export default async function Inventory({
	params,
}: {
	params: { location: string };
}) {
	const name = await getLocationName(params.location);

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
					<div className='flex gap-2'>
						<Header className='mb-4'>{name}</Header>
						<EditLocation name={name!} id={params.location} />
					</div>
					<NewProduct location={params.location} />
				</div>
				<Suspense fallback={<TableLoading />}>
					{/* @ts-ignore */}
					<InventoryTable id={params.location} />
				</Suspense>
			</div>
		</>
	);
}
