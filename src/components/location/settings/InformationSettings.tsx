'use client';

import ArrowButton from '@components/ArrowButton';
import FormGroup from '@components/FormGroup';
import Loader from '@components/ui/loader';
import { useQuery } from '@tanstack/react-query';
import { Plus, Save } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type LocationData = {
	name: string;
};

export default function InformationSettings({
	locationId,
}: {
	locationId: string;
}) {
	const [locationName, setLocationName] = useState('');
	const {
		data,
		isLoading,
	}: { data: LocationData | undefined; isLoading: boolean } = useQuery({
		queryKey: ['locations', locationId],
		queryFn: async () => {
			const res = await fetch(`/api/locations?id=${locationId}&single=true`);
			return await res.json();
		},
	});

	useEffect(() => {
		if (data) setLocationName(data.name);
	}, [data]);

	return (
		<>
			<div className='max-w-md'>
				{isLoading ? (
					<Loader />
				) : (
					<FormGroup
						label='Location Name'
						value={locationName}
						vertical
						onChange={(e) => setLocationName(e.target.value)}
					/>
				)}
			</div>
			<ArrowButton
				className='mt-8'
				Icon={Save}
				isLoading={isLoading}
				disabled={isLoading || data?.name === locationName}
				variant='primary'
			>
				Save
			</ArrowButton>
		</>
	);
}
