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
import {
	Area,
	AreaChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className='px-3 py-2 border rounded-md shadow-md bg-content'>
				<span>{label}</span>
				<span className='ml-6'>{payload[0].value}</span>
			</div>
		);
	}
	return null;
};

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
	if (locationData === undefined)
		return (
			<div className='grid w-full h-[200px] place-content-center text-muted-foreground'>
				No data available.
			</div>
		);
	if (locationData[dataKey].length === 0)
		return (
			<div className='grid w-full h-[200px] place-content-center text-muted-foreground'>
				No products to aggregate.
			</div>
		);
	return (
		<div className='h-[200px] mt-8'>
			<ResponsiveContainer width='100%' height='100%'>
				<AreaChart
					data={locationData[dataKey]}
					margin={{
						left: -32,
					}}
				>
					<defs>
						<linearGradient id='colorPrimary' x1='0' y1='0' x2='0' y2='1'>
							<stop
								offset='5%'
								stopColor='hsl(var(--primary))'
								stopOpacity={0.8}
							/>
							<stop
								offset='95%'
								stopColor='hsl(var(--primary))'
								stopOpacity={0}
							/>
						</linearGradient>
					</defs>
					<XAxis dataKey='date' />
					<YAxis />
					<Tooltip
						cursor={{ fill: 'hsl(var(--muted))', radius: 4 }}
						content={<CustomTooltip />}
						isAnimationActive={false}
					/>
					<Area
						type='monotone'
						dataKey='quantity'
						fill='url(#colorPrimary)'
						stroke='hsl(var(--primary))'
						animationDuration={600}
						animationEasing='ease-in-out'
					/>
				</AreaChart>
			</ResponsiveContainer>
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
		<div className='mt-8 animate-[fade-in_500ms]'>
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
