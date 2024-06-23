'use client';

import BarChart from '@components/BarChart';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@components/ui/select';
import { useState } from 'react';
import { DashboardPopularItemData } from '../DashboardModules';

export default function PopularItems({
	data,
}: {
	data: DashboardPopularItemData[];
}) {
	const [selectedLocation, setSelectedLocation] = useState<string>(
		data[0]?.name ?? ''
	);

	return (
		<div className='mt-8'>
			<div className='flex flex-wrap items-center justify-between gap-8'>
				<Select value={selectedLocation} onValueChange={setSelectedLocation}>
					<SelectTrigger className='w-[250px] [&>span]:overflow-hidden [&>span]:overflow-ellipsis [&>span]:whitespace-nowrap [&>span]:pr-1'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{data?.map((entry) => (
							<SelectItem key={entry.name} value={entry.name}>
								{entry.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className='h-[200px] mt-[106px]'>
				<BarChart
					data={
						data.find((entry) => entry.name === selectedLocation)?.data ?? []
					}
					xAxisKey='name'
				/>
			</div>
		</div>
	);
}
