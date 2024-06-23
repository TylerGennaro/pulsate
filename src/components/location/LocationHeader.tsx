'use client';

import { ContainerHeader } from '@components/Container';
import { Button } from '@components/ui/button';
import Header from '@components/ui/header';
import { Skeleton } from '@components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type LocationHeaderProps = {
	location: string;
};

type LocationData = {
	name: string;
	user: {
		name: string;
	};
};

export default function LocationHeader({ location }: LocationHeaderProps) {
	const {
		data,
		isLoading,
	}: { data: LocationData | undefined; isLoading: boolean } = useQuery({
		queryKey: ['locations', location],
		queryFn: async () => {
			const res = await fetch(`/api/locations?id=${location}&single=true`);
			const json: { locations: LocationData } = await res.json();
			return json.locations;
		},
	});
	if (isLoading)
		return (
			<div className='flex flex-col gap-2 my-4'>
				<Skeleton className='w-40 h-8' />
				<Skeleton className='w-56 h-4' />
			</div>
		);
	if (!data) return notFound();
	return (
		<div className='flex gap-4 my-4'>
			<Link href={`/app`} className='block mt-0.5 w-fit'>
				<Button size='icon' variant='outline' className='bg-content'>
					<ChevronLeft size={16} />
				</Button>
			</Link>
			<div>
				<Header size='md'>{data.name}</Header>
				<span className='text-sm text-muted-foreground'>{`Managed by ${
					data.user.name ?? 'Unknown User'
				}`}</span>
			</div>
		</div>
	);
}
