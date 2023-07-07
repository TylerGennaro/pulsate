'use client';

import { Skeleton } from '@components/ui/skeleton';

const iterator = Array.from(Array(10).keys());

export default function TableLoading() {
	return (
		<div>
			<div className='flex justify-between items-center'>
				<Skeleton className='w-72 h-10' />
				<Skeleton className='w-36 h-10' />
			</div>
			<div className='mt-10 flex flex-col gap-2'>
				{iterator.map((i) => (
					<Skeleton className='w-full h-10' key={i} />
				))}
			</div>
		</div>
	);
}
