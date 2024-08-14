'use client';

import { updateLocationName } from '@actions/locations';
import ArrowButton from '@components/ArrowButton';
import FormGroup from '@components/FormGroup';
import Loader from '@components/ui/loader';
import { toast } from '@components/ui/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Save } from 'lucide-react';
import { useEffect, useRef, useState, useTransition } from 'react';

type LocationData = {
	name: string;
};

export default function InformationSettings({
	locationId,
}: {
	locationId: string;
}) {
	const [locationName, setLocationName] = useState('');
	const [isUpdatePending, startUpdateTransition] = useTransition();
	const queryClient = useQueryClient();

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

	const saveClick = () => {
		startUpdateTransition(async () => {
			const response = await updateLocationName(locationId, locationName);
			if (!response.ok) {
				toast.error('Failed to update location name', response.message);
				return;
			}
			queryClient.invalidateQueries({ queryKey: ['locations'] });
			toast.success('Location name updated.');
		});
	};

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
				isLoading={isLoading || isUpdatePending}
				disabled={isLoading || data?.name === locationName}
				variant='primary'
				onClick={saveClick}
			>
				Save
			</ArrowButton>
		</>
	);
}
