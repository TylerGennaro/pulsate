'use client';

import { ContainerHeader } from '@components/Container';
import { Skeleton } from '@components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
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
			<div className='flex flex-col gap-2'>
				<Skeleton className='w-40 h-8' />
				<Skeleton className='w-56 h-6' />
			</div>
		);
	if (!data) return notFound();
	return (
		<ContainerHeader
			header={data.name}
			description={`Managed by ${data.user.name ?? 'Unknown User'}`}
		/>
	);
}
