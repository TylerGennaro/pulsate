'use client';

import Container from '@components/Container';
import Heading from '@components/ui/heading';
import CheckoutHistory from './(modules)/CheckoutHistory';
import CheckoutUsers from './(modules)/CheckoutUsers';
import PopularItems from './(modules)/PopularItems';
import StockAlerts from './(modules)/StockAlerts';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@components/ui/skeleton';

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

type DashboardModuleData = {
	checkoutHistory: DashboardDateRangeData[];
	popularItems: DashboardPopularItemData[];
};

export default function DashboardModules() {
	const {
		data,
		isPending,
	}: { data: DashboardModuleData | undefined; isPending: boolean } = useQuery({
		queryKey: ['checkout-history'],
		queryFn: async () => {
			const results = await fetch('/api/locations/stats');
			const json = await results.json();
			return json;
		},
	});
	if (isPending || data === undefined) return <DashboardModulesSkeleton />;
	return (
		<>
			<div className='grid grid-cols-3 col-span-2 gap-8'>
				<Container>
					<span>Locations</span>
				</Container>
				<Container>
					<span>Products</span>
				</Container>
				<Container>
					<span>Total Stock</span>
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
				<StockAlerts />
			</Container>
			<Container className='h-fit'>
				<Heading
					header='Users'
					description='Users who have checked out items'
				/>
				<CheckoutUsers />
			</Container>
		</>
	);
}

function DashboardModulesSkeleton() {
	return (
		<>
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
				<CheckoutUsers />
			</Container>
		</>
	);
}
