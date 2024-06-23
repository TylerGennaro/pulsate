'use client';

import BarChart from '@components/BarChart';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { useMemo, useState } from 'react';
import { DashboardDateRangeData } from '../DashboardModules';

function TabChart({
	data,
	dataKey,
	selectedLocation,
}: {
	data: DashboardDateRangeData[];
	dataKey: keyof Omit<DashboardDateRangeData, 'name'>;
	selectedLocation: string;
}) {
	const locationData = data.find((entry) => entry.name === selectedLocation);
	const totals = useMemo(() => {
		if (!locationData) return;
		return {
			week: locationData.week.reduce((acc, curr) => acc + curr.quantity, 0),
			biweek: locationData.biweek.reduce((acc, curr) => acc + curr.quantity, 0),
			month: locationData.month.reduce((acc, curr) => acc + curr.quantity, 0),
		};
	}, [locationData]);
	if (totals === undefined || locationData === undefined)
		return <span>No data available.</span>;
	const isEmpty = totals.week + totals.biweek + totals.month === 0;
	return (
		<div className='h-[200px] mt-8'>
			<BarChart
				data={isEmpty ? [] : locationData[dataKey] ?? []}
				xAxisKey='date'
			/>
		</div>
	);
}

export default function CheckoutHistory({
	data,
}: {
	data: DashboardDateRangeData[];
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
			<Tabs className='mt-8' defaultValue='week'>
				<TabsList>
					<TabsTrigger value='week'>Week</TabsTrigger>
					<TabsTrigger value='biweek'>2 Weeks</TabsTrigger>
					<TabsTrigger value='month'>Month</TabsTrigger>
				</TabsList>
				<TabsContent value='week'>
					<TabChart
						data={data ?? []}
						dataKey='week'
						selectedLocation={selectedLocation}
					/>
				</TabsContent>
				<TabsContent value='biweek'>
					<TabChart
						data={data ?? []}
						dataKey='biweek'
						selectedLocation={selectedLocation}
					/>
				</TabsContent>
				<TabsContent value='month'>
					<TabChart
						data={data ?? []}
						dataKey='month'
						selectedLocation={selectedLocation}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
