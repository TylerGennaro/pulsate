import QRCode from '@components/QRCode';
import Header from '@components/ui/Header';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { cn } from '@lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { db } from '@lib/prisma';
import ItemTable from './ItemTable';
import NewItemDialog from './NewItemDialog';
import { Item, Product } from '@prisma/client';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@components/ui/tooltip';
import { Tag } from '@lib/enum';
import { isExpiring } from '@lib/date';
import { tags as tagList } from '@lib/tags';

function Container({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn('border rounded-md p-8', className)}>{children}</div>
	);
}

async function getData(
	id: string
): Promise<{ data: Product | null; tags: Tag[] }> {
	const data = await db.product.findFirst({
		include: {
			items: {
				orderBy: {
					expires: 'asc',
				},
			},
		},
		where: {
			id,
		},
	});
	const quantity = (
		await db.item.aggregate({
			where: {
				productId: id,
			},
			_sum: {
				quantity: true,
			},
		})
	)._sum.quantity!;
	const exp = data!.items.reduce(
		(acc: Date | string, item: Item) =>
			new Date(item.expires) < acc || acc === '' ? new Date(item.expires) : acc,
		''
	);
	const tags = [];
	if (quantity! < data!.min) tags.push(Tag.LOW);
	if (isExpiring(exp) && quantity > 0) tags.push(Tag.EXPIRES);
	return { data, tags };
}

export default async function Inventory({
	params,
}: {
	params: { location: string; item: string };
}) {
	const { data, tags } = await getData(params.item);
	// console.dir(data, { depth: Infinity });
	if (!data) return null;
	return (
		<div className='container py-8'>
			<Link href={`/inventory/${params.location}`}>
				<Button
					className='w-fit mb-8 p-0 hover:bg-background hover:text-muted-foreground'
					variant='ghost'
				>
					<ChevronLeft className='w-4 h-4 mr-2' />
					Go back
				</Button>
			</Link>
			<div className='flex flex-col gap-8'>
				<Container>
					<Header size='lg'>{data.name}</Header>
					<Tooltip>
						<TooltipTrigger asChild>
							<span className='text-muted-foreground mt-2 block w-fit'>
								{data.id}
							</span>
						</TooltipTrigger>
						<TooltipContent>
							<p>The item's unique ID</p>
						</TooltipContent>
					</Tooltip>
					<div className='mt-8 flex gap-2'>
						{tags.map((tag) => {
							const tagData = tagList[tag];
							return (
								<Badge
									key={tagData.label}
									className={`border-${tagData.color} text-${tagData.color}`}
									variant='outline'
								>
									{tagData.label}
								</Badge>
							);
						})}
					</div>
				</Container>
				<div className='flex flex-col md:flex-row gap-8'>
					<div className='w-full'>
						<Container className='w-full'>
							<div className='mb-4'>
								<NewItemDialog
									location={params.location}
									product={params.item}
								/>
							</div>
							{/* @ts-expect-error */}
							<ItemTable data={data.items} />
						</Container>
						<Container className='w-full mt-8'>
							<span className='text-lg mb-4 block'>Log</span>
							{/* <DataTable columns={columns} data={data} /> */}
						</Container>
					</div>
					<Container className='flex flex-col items-center h-fit'>
						<QRCode
							location={params.location}
							uid={params.item}
							name={data.name}
						/>
					</Container>
				</div>
			</div>
		</div>
	);
}
