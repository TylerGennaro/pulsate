'use client';

import ArrowButton from '@components/ArrowButton';
import Container from '@components/Container';
import NewLocationDialog from '@components/NewLocation';
import Header from '@components/ui/header';
import Heading from '@components/ui/heading';
import { Skeleton } from '@components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { Archive, Package, Plus, Warehouse } from 'lucide-react';
import CheckoutHistory from './(modules)/CheckoutHistory';
import CheckoutUsers from './(modules)/CheckoutUsers';
import PopularItems from './(modules)/PopularItems';
import StockAlerts from './(modules)/StockAlerts';
import CountUp from '@components/CountUp';

export type DateRangeEntry = {
	quantity: number;
	date: Date;
};

export type DashboardDateRangeData = {
	name: string;
	week: DateRangeEntry[];
	biweek: DateRangeEntry[];
	month: DateRangeEntry[];
};

export type DashboardPopularItemData = {
	name: string;
	data: DashboardPopularItemEntry[];
};

export type DashboardPopularItemEntry = {
	name: string;
	quantity: number;
};

export type StockAlert =
	| {
			name: string;
			location: string;
			expires: string;
	  }
	| {
			name: string;
			location: string;
			quantity: number;
	  };

export type CheckoutUser = {
	userId: string;
	name: string;
	email: string;
	image: string | null;
	quantity: number;
};

type DashboardModuleData = {
	checkoutHistory: DashboardDateRangeData[];
	popularItems: DashboardPopularItemData[];
	stockAlerts: StockAlert[];
	totals: {
		totalLocations: number;
		totalProducts: number;
		totalStock: number;
	};
	checkoutUsers: CheckoutUser[];
};

export default function DashboardModules() {
	const {
		data,
		isPending,
	}: { data: DashboardModuleData | undefined; isPending: boolean } = useQuery({
		queryKey: ['dashboard'],
		queryFn: async () => {
			const results = await fetch('/api/locations/stats');
			if (results.status === 204) return undefined;
			const json = await results.json();
			return json;
		},
	});
	if (isPending) return <DashboardModulesSkeleton />;
	if (!data) return <NoDashboardData />;
	return (
		<>
			<div className='grid grid-cols-3 col-span-2 gap-8'>
				<Container>
					<div className='flex justify-between mb-2'>
						<p className='text-sm font-medium text-muted-foreground'>
							Locations
						</p>
						<Warehouse size={16} className='text-muted-foreground' />
					</div>
					<p className='text-2xl font-bold animate-[fade-in_500ms]'>
						<CountUp value={data.totals.totalLocations} />
					</p>
				</Container>
				<Container>
					<div className='flex justify-between mb-2'>
						<p className='text-sm font-medium text-muted-foreground'>
							Products
						</p>
						<Archive size={16} className='text-muted-foreground' />
					</div>
					<p className='text-2xl font-bold animate-[fade-in_500ms]'>
						<CountUp value={data.totals.totalProducts} />
					</p>
				</Container>
				<Container>
					<div className='flex justify-between mb-2'>
						<p className='text-sm font-medium text-muted-foreground'>
							Total Stock
						</p>
						<Package size={16} className='text-muted-foreground' />
					</div>
					<p className='text-2xl font-bold animate-[fade-in_500ms]'>
						<CountUp value={data.totals.totalStock} />
					</p>
				</Container>
			</div>
			<Container>
				<Heading
					header='Checkout History'
					description='Number of items checked out by location.'
				/>
				<CheckoutHistory data={data.checkoutHistory} />
			</Container>
			<Container>
				<Heading
					header='Popular Items'
					description='Products with the most checkouts in the last month by location.'
				/>
				<PopularItems data={data.popularItems} />
			</Container>
			<Container>
				<Heading
					header='Stock Alerts'
					description='Products with low or expiring stock.'
				/>
				<StockAlerts data={data.stockAlerts} />
			</Container>
			<Container className='h-fit'>
				<Heading
					header='Users'
					description='Users who have checked out items'
				/>
				<CheckoutUsers data={data.checkoutUsers} />
			</Container>
		</>
	);
}

function DashboardModulesSkeleton() {
	return (
		<>
			<div className='grid grid-cols-3 col-span-2 gap-8'>
				<Container>
					<div className='flex justify-between mb-2'>
						<p className='text-sm font-medium text-muted-foreground'>
							Locations
						</p>
						<Warehouse size={16} className='text-muted-foreground' />
					</div>
					<Skeleton className='w-8 h-8' />
				</Container>
				<Container>
					<div className='flex justify-between mb-2'>
						<p className='text-sm font-medium text-muted-foreground'>
							Products
						</p>
						<Archive size={16} className='text-muted-foreground' />
					</div>
					<Skeleton className='w-16 h-8' />
				</Container>
				<Container>
					<div className='flex justify-between mb-2'>
						<p className='text-sm font-medium text-muted-foreground'>
							Total Stock
						</p>
						<Package size={16} className='text-muted-foreground' />
					</div>
					<Skeleton className='w-16 h-8' />
				</Container>
			</div>
			<Container>
				<Heading
					header='Checkout History'
					description='Number of items checked out by location.'
				/>
				<Skeleton className='w-64 h-10 mt-8' />
				<div className='flex gap-4 mt-6'>
					<Skeleton className='w-24 h-8 mt-2' />
					<Skeleton className='w-24 h-8 mt-2' />
					<Skeleton className='w-24 h-8 mt-2' />
				</div>
				<hr className='mt-2' />
				<Skeleton className='h-[200px] mt-8' />
			</Container>
			<Container>
				<Heading
					header='Popular Items'
					description='Products with the most checkouts in the last month by location.'
				/>
				<Skeleton className='w-64 h-10 mt-8' />
				<Skeleton className='h-[200px] mt-[106px]' />
			</Container>
			<Container>
				<Heading
					header='Stock Alerts'
					description='Products with low or expiring stock.'
				/>
				<div className='mt-8'>
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className='flex items-center justify-between p-2 border-b last-of-type:border-none'
						>
							<div className='flex items-center gap-8'>
								<Skeleton className='w-7 h-7' />
								<div className='flex flex-col gap-2'>
									<Skeleton className='w-32 h-6' />
									<Skeleton className='w-24 h-4' />
								</div>
							</div>
							<Skeleton className='w-32 h-6' />
						</div>
					))}
				</div>
			</Container>
			<Container className='h-fit'>
				<Heading
					header='Users'
					description='Users who have checked out items'
				/>
				<div className='mt-8'>
					{Array.from({ length: 2 }).map((_, i) => (
						<div
							key={i}
							className='flex items-center justify-between py-4 border-b last-of-type:border-none'
						>
							<div className='flex items-center gap-4'>
								<Skeleton className='w-10 h-10 rounded-full' />
								<div className='flex flex-col gap-2'>
									<Skeleton className='h-6 w-28' />
									<Skeleton className='w-48 h-4' />
								</div>
							</div>
							<Skeleton className='w-20 h-6' />
						</div>
					))}
				</div>
			</Container>
		</>
	);
}

function NoDashboardData() {
	return (
		<div className='flex flex-col items-center col-span-2 mt-32'>
			<Header className='mb-4'>You have no locations!</Header>
			<NewLocationDialog>
				<ArrowButton Icon={Plus} variant='primary'>
					Create your first
				</ArrowButton>
			</NewLocationDialog>
		</div>
	);
}
