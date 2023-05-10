import QRCode from '@components/QRCode';
import Header from '@components/ui/Header';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { cn } from '@lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Log, columns } from './columns';
import { DataTable } from '@components/ui/data-table';

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

async function getData(): Promise<Log[]> {
	return [
		{ user: 'John Doe', date: '2021-09-01', change: 5, newQuantity: 5 },
		{ user: 'John Doe', date: '2021-09-02', change: -2, newQuantity: 3 },
	];
}

export default async function Inventory({
	params,
}: {
	params: { location: string; item: string };
}) {
	const data = await getData();
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
						<Header size='lg'>Cervical Collar</Header>
					</div>
					<span className='text-muted-foreground mt-2 block'>
						{params.item}
					</span>
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
						</Container>
						<Container className='w-full mt-8'>
							<span className='text-lg mb-4 block'>Log</span>
							<DataTable columns={columns} data={data} />
						</Container>
					</div>
					<Container className='flex flex-col items-center h-fit'>
						<QRCode
							location={params.location}
							uid={params.item}
							name='Cervical Collar'
						/>
					</Container>
				</div>
			</div>
		</div>
	);
}
