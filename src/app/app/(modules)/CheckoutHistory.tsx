'use client';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { CSSProperties, useState } from 'react';
import {
	Bar,
	BarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

type DateRangeEntry = {
	quantity: number;
	date: Date;
};

type DashboardStat = {
	name: string;
	week: DateRangeEntry[];
	biweek: DateRangeEntry[];
	month: DateRangeEntry[];
};

const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className='px-3 py-2 border rounded-md shadow-md bg-content'>
				<p>{`${label} - ${payload[0].value}`}</p>
			</div>
		);
	}
	return null;
};

export default function CheckoutHistory() {
	const [selectedLocation, setSelectedLocation] = useState<string>('');
	const {
		data,
		isPending,
	}: { data: DashboardStat[] | undefined; isPending: boolean } = useQuery({
		queryKey: ['checkout-history'],
		queryFn: async () => {
			const results = await fetch('/api/locations/stats');
			const json = await results.json();
			if (selectedLocation === '') {
				setSelectedLocation(json[0].name);
			}
			return json;
		},
	});
	console.log(data);
	return (
		<div className='mt-8'>
			<div className='flex flex-wrap items-center justify-between gap-8'>
				<Select value={selectedLocation} onValueChange={setSelectedLocation}>
					<SelectTrigger
						isLoading={isPending}
						className='w-[250px] [&>span]:overflow-hidden [&>span]:overflow-ellipsis [&>span]:whitespace-nowrap [&>span]:pr-1'
					>
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
					<div className='h-[200px] mt-8'>
						<ResponsiveContainer width='100%' height='100%'>
							<BarChart
								data={
									data?.find((entry) => entry.name === selectedLocation)
										?.week ?? []
								}
								margin={{
									left: -32,
								}}
							>
								<XAxis dataKey='date' />
								<YAxis />
								<Tooltip
									cursor={{ fill: 'hsl(var(--muted))', radius: 4 }}
									content={<CustomTooltip />}
									isAnimationActive={false}
								/>
								<Bar
									dataKey='quantity'
									style={
										{
											fill: 'hsl(var(--primary))',
										} as CSSProperties
									}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</TabsContent>
				<TabsContent value='biweek'>
					<div className='h-[200px] mt-8'>
						<ResponsiveContainer width='100%' height='100%'>
							<BarChart
								data={
									data?.find((entry) => entry.name === selectedLocation)
										?.biweek ?? []
								}
								margin={{
									left: -32,
								}}
							>
								<XAxis dataKey='date' />
								<YAxis />
								<Tooltip
									cursor={{ fill: 'hsl(var(--muted))', radius: 4 }}
									content={<CustomTooltip />}
									isAnimationActive={false}
								/>
								<Bar
									dataKey='quantity'
									style={
										{
											fill: 'hsl(var(--primary))',
										} as CSSProperties
									}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</TabsContent>
				<TabsContent value='month'>
					<div className='h-[200px] mt-8'>
						<ResponsiveContainer width='100%' height='100%'>
							<BarChart
								data={
									data?.find((entry) => entry.name === selectedLocation)
										?.month ?? []
								}
								margin={{
									left: -32,
								}}
							>
								<XAxis dataKey='date' />
								<YAxis />
								<Tooltip
									cursor={{ fill: 'hsl(var(--muted))', radius: 4 }}
									content={<CustomTooltip />}
									isAnimationActive={false}
								/>
								<Bar
									dataKey='quantity'
									style={
										{
											fill: 'hsl(var(--primary))',
										} as CSSProperties
									}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
