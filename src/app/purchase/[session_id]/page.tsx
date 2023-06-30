import Logo from '@components/Logo';
import Header from '@components/ui/header';
import Loader from '@components/ui/loader';
import { populateMetadata } from '@lib/utils';
import { Check } from 'lucide-react';

export const metadata = populateMetadata('Payment Confirmation');

export default async function Page({
	params,
}: {
	params: { session_id: string };
}) {
	const session = await fetch(
		`${process.env.NEXT_PUBLIC_PROJECT_URL}/api/purchase?id=${params.session_id}`,
		{
			next: {
				revalidate: 60,
			},
		}
	).then((res) => res.json());

	return (
		<div className='flex flex-col items-center gap-8 p-8 mx-auto mt-16 border rounded-md shadow-sm bg-zinc-50 dark:bg-zinc-900 w-fit'>
			<Logo className='self-start mb-4' />
			<Header>Payment submitted</Header>
			{session.status === 'complete' ? (
				<div className='flex items-center gap-2'>
					<div className='p-1 bg-green-700 border rounded-full text-zinc-50 w-fit border-zinc-50'>
						<Check className='w-4 h-4' />
					</div>
					<span className='text-lg'>Complete</span>
				</div>
			) : (
				<div className='flex items-center gap-2'>
					<Loader className='w-6 h-6' />
					<span>Loading...</span>
				</div>
			)}
		</div>
	);
}
