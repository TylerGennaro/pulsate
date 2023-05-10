import { Button } from '@components/ui/button';
import LocationCard from './LocationCard';
import { Plus } from 'lucide-react';
import Header from '@components/ui/Header';

export interface Location {
	uid: string;
	name: string;
	hasLow: boolean;
	hasExpired?: boolean;
}

async function getData(): Promise<Location[]> {
	return [
		{
			uid: 'station-154',
			name: 'Station 154',
			hasLow: true,
		},
		{
			uid: 'station-155',
			name: 'Station 155',
			hasLow: false,
		},
		{
			uid: 'station-156',
			name: 'Station 156',
			hasLow: false,
			hasExpired: true,
		},
	];
}

export default async function Page() {
	const data = await getData();

	return (
		<div className='container py-8'>
			<Button className='mb-4'>
				<Plus className='w-4 h-4 mr-2' />
				New Location
			</Button>
			<div className='flex flex-col gap-4'>
				{data.map((location) => (
					<LocationCard location={location} key={location.uid} />
				))}
			</div>
		</div>
	);
}
