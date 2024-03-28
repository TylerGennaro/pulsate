import { getServerSession } from 'next-auth';
import SignIn from '@components/SignIn';
import { authOptions } from '@lib/auth';
import { db } from '@lib/prisma';
import { Button } from '@components/ui/button';
import { capitalize, populateMetadata } from '@lib/utils';
import { formatDate } from '@lib/date';
import PaymentTable from './PaymentTable';
import { Suspense } from 'react';
import { Skeleton } from '@components/ui/skeleton';

export const metadata = populateMetadata('Billing Settings');

async function getData(userId: string) {
	const subscription = await db.subscription.findFirst({
		where: {
			userId,
			status: 'active',
		},
	});
	const payments = await db.payment.findMany({
		where: {
			userId,
		},
	});
	return { subscription, payments };
}

export default async function Page() {
	const session = await getServerSession(authOptions);
	if (!session) return <SignIn />;
	const { subscription, payments } = await getData(session.user.id);

	return (
		<div className='flex flex-col'>
			{subscription !== null && (
				<div className='p-[3px] bg-gradient-to-t to-blue-600 from-blue-300 dark:from-blue-900 dark:to-blue-500 rounded-2xl m-4'>
					<div className='flex items-center justify-between p-4 shadow-xl bg-zinc-50/90 dark:bg-zinc-800/90 rounded-xl'>
						<span className='text-lg font-medium'>
							{subscription.tier} subscription is active
						</span>
						<div className='flex gap-x-2'>
							<Button variant='ghost'>Cancel</Button>
							<Button>Switch Plans</Button>
						</div>
					</div>
				</div>
			)}
			<div className='grid grid-cols-3 border-y bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-700'>
				<div className='flex flex-col gap-2 p-8 border-r dark:border-zinc-700'>
					<span className='text-muted-foreground'>Plan</span>
					<span className='text-xl'>
						{capitalize((subscription?.tier as string) || 'None')}
					</span>
				</div>
				<div className='flex flex-col gap-2 p-8 border-r dark:border-zinc-700'>
					<span className='text-muted-foreground'>Status</span>
					<span className='text-xl'>
						{capitalize(subscription?.status || '-')}
					</span>
				</div>
				<div className='flex flex-col gap-2 p-8'>
					<span className='text-muted-foreground'>Renews</span>
					<span className='text-xl'>
						{subscription?.current_period_end
							? formatDate(subscription?.current_period_end)
							: '-'}
					</span>
				</div>
			</div>
			<div className='p-4 mt-8'>
				<span className='block mb-4 text-lg font-medium text-muted-foreground'>
					Payments
				</span>
				<Suspense
					fallback={
						<div className='flex flex-col gap-1'>
							{Array.from({ length: payments.length + 1 }).map((_, i) => (
								<Skeleton key={i} className='w-full h-8' />
							))}
						</div>
					}
				>
					{/* @ts-ignore */}
					<PaymentTable payments={payments} />
				</Suspense>
			</div>
		</div>
	);
}
