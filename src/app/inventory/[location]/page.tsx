import InventoryTable from './InventoryTable';
import { Button } from '@components/ui/button';
import { ChevronLeft } from 'lucide-react';
import NewItemSheet from './NewItemSheet';
import Link from 'next/link';
import Header from '@components/ui/Header';
import { db } from '@lib/prisma';
import { Item, Location, Product } from '@prisma/client';
import { Tag } from '@lib/enum';
import { isExpiring } from '@lib/date';
import EditLocation from './EditLocation';

export async function generateMetadata({
	params,
}: {
	params: { location: string };
}) {
	const data = await getData(params.location);
	return {
		title: `${data.location} | LFHRS Inventory`,
		description: `Manage medical supply inventory for ${data.location}.`,
	};
}

async function getData(
	location: string
): Promise<{ products: ProductInfo[]; location: string }> {
	const dataFetch = db.product.findMany({
		include: {
			location: true,
			items: true,
		},
		where: {
			locationId: location,
		},
	});
	const locationFetch = db.location.findFirst({
		select: {
			name: true,
		},
		where: {
			id: location,
		},
	});
	const [data, locationName] = await Promise.all([dataFetch, locationFetch]);
	const extended = data.map(
		(product: Product & { location: Location; items: Item[] }) => {
			const quantity = product.items.reduce(
				(acc: number, item: Item) => acc + item.quantity,
				0
			);
			const exp = product.items.reduce(
				(acc: Date | string, item: Item) =>
					item.expires !== null && (new Date(item.expires) < acc || acc === '')
						? new Date(item.expires)
						: acc,
				''
			);
			const hasOnOrder = product.items.some((item) => item.onOrder);
			const tags = [];
			if (quantity < product.min) tags.push(Tag.LOW);
			if (isExpiring(exp) && quantity > 0) tags.push(Tag.EXPIRES);
			if (hasOnOrder) tags.push(Tag.ONORDER);
			return {
				quantity,
				exp,
				tags,
				...product,
			};
		}
	);
	// console.dir(extended, { depth: Infinity });

	return { products: extended, location: locationName!.name };
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
					<div className='flex gap-2'>
						<Header className='mb-4'>{data.location}</Header>
						<EditLocation name={data.location} id={params.location} />
					</div>
					<NewItemSheet location={params.location} />
				</div>
					<InventoryTable data={data.products} />
			</div>
		</>
	);
}
