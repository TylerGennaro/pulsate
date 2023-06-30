import { getServerSession } from 'next-auth';
import SignIn from '@components/SignIn';
import { authOptions } from '@lib/auth';
import { db } from '@lib/prisma';
import { Button } from '@components/ui/button';
import { populateMetadata } from '@lib/utils';

export const metadata = populateMetadata('Billing Settings');

async function getData(userId: string) {
	const subscription = await db.subscription.findFirst({
		where: {
			userId,
		},
	});
	return subscription;
}

export default async function Page() {
	const session = await getServerSession(authOptions);
	if (!session) return <SignIn />;
	const data = await getData(session.user.id);

	return (
		<div className='flex flex-col'>
			<div className='p-[3px] bg-gradient-to-t to-blue-600 from-blue-300 dark:from-blue-900 dark:to-blue-500 rounded-2xl m-4'>
				<div className='flex items-center justify-between p-4 shadow-xl bg-zinc-50/90 dark:bg-zinc-800/90 rounded-xl'>
					<span className='text-lg font-medium'>
						Manager subscription is active
					</span>
					<div className='flex gap-x-2'>
						<Button variant='ghost'>Cancel</Button>
						<Button>Switch Plans</Button>
					</div>
				</div>
			</div>
			<div className='grid grid-cols-3 border-y bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-700'>
				<div className='flex flex-col gap-2 p-8 border-r dark:border-zinc-700'>
					<span className='text-muted'>Plan</span>
					<span className='text-xl'>Manager</span>
				</div>
				<div className='flex flex-col gap-2 p-8 border-r dark:border-zinc-700'>
					<span className='text-muted'>Status</span>
					<span className='text-xl'>Active</span>
				</div>
				<div className='flex flex-col gap-2 p-8'>
					<span className='text-muted'>Renews</span>
					<span className='text-xl'>Jul 25, 2023</span>
				</div>
			</div>
			<div>
				<span>Payments</span>
			</div>
		</div>
	);
}
