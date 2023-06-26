import Loader from '@components/ui/loader';
import { Check } from 'lucide-react';

export default async function Page({
	params,
}: {
	params: { session_id: string };
}) {
	const session = await fetch(
		`${process.env.NEXT_PUBLIC_PROJECT_URL}/api/purchase?id=${params.session_id}`,
		{
			next: {
				revalidate: 10,
			},
		}
	).then((res) => res.json());

	return (
		<div>
			<h1>Session {params.session_id}</h1>
			<p>Session data: {JSON.stringify(session)}</p>
			<div>
				Status:{' '}
				{session.status === 'complete' ? (
					<div className='flex items-center gap-2'>
						<div className='p-1 bg-green-700 border-2 rounded-full text-zinc-50 w-fit border-zinc-50'>
							<Check className='w-3 h-3' />
						</div>
						<span>Complete</span>
					</div>
				) : (
					<div className='flex items-center gap-2'>
						<Loader className='w-6 h-6' />
						<span>Loading...</span>
					</div>
				)}
			</div>
		</div>
	);
}
