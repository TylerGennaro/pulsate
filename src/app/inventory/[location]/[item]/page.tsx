import QRCode from '@components/QRCode';
import Header from '@components/ui/Header';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { cn } from '@lib/utils';
import { ChevronLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { db } from '@lib/prisma';
import { Product } from '@prisma/client';
import ItemTable from './ItemTable';
import NewItemDialog from './NewItemDialog';

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

async function getData(id: string): Promise<Product | null> {
	const data = await db.product.findFirst({
		include: {
			items: true,
		},
		where: {
			id,
		},
	});
	return data;
	// return [
	// 	{ user: 'John Doe', date: 1683743587760, change: -2, newQuantity: 3 },
	// 	{ user: 'John Doe', date: 1573642547760, change: 5, newQuantity: 5 },
	// ];
}

export default async function Inventory({
	params,
}: {
	params: { location: string; item: string };
}) {
	const data = await getData(params.item);
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
					<div className='flex flex-col items-start gap-4'>
						<Badge variant='destructive'>Quantity Low</Badge>
						<Header size='lg'>{data.name}</Header>
					</div>
					<span className='text-muted-foreground mt-2 block'>{data.id}</span>
				</Container>
				<div className='flex flex-col md:flex-row gap-8'>
					<div className='w-full'>
						<Container className='w-full'>
							<div className='flex flex-col gap-2'>
								<span className='text-lg'>Quantity</span>
								<div className='flex w-full max-w-xs space-x-2 items-center'>
									<Input
										defaultValue={8}
										type='number'
										placeholder='Quantity'
										className='text-lg'
									/>
									<Button className='whitespace-nowrap'>Save changes</Button>
								</div>
							</div>
							<NewItemDialog />
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
