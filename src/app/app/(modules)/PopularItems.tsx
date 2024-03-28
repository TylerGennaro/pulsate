'use client';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@components/ui/tabs';
import { CSSProperties } from 'react';
import {
	Bar,
	BarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

const data = [
	{
		name: 'Item 9',
		quantity: 60,
	},
	{
		name: 'Item 8',
		quantity: 50,
	},
	{
		name: 'Item 7',
		quantity: 30,
	},
	{
		name: 'Item 6',
		quantity: 25,
	},
	{
		name: 'Item 5',
		quantity: 16,
	},
	{
		name: 'Item 4',
		quantity: 12,
	},
	{
		name: 'Item 3',
		quantity: 7,
	},
	{
		name: 'Item 2',
		quantity: 5,
	},
	{
		name: 'Item 1',
		quantity: 4,
	},
	{
		name: 'Cervical Collar',
		quantity: 2,
	},
];

const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className='px-3 py-2 border rounded-md shadow-md bg-content'>
				<p>{`${label}: ${payload[0].value}`}</p>
			</div>
		);
	}
	return null;
};

export default function PopularItems() {
	return (
		<div className='mt-8'>
			<div className='flex flex-wrap items-center justify-between gap-8'>
				<Select value='ghdfsm'>
					<SelectTrigger className='w-[250px] [&>span]:overflow-hidden [&>span]:overflow-ellipsis [&>span]:whitespace-nowrap [&>span]:pr-1'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='abcded'>Test Location</SelectItem>
						<SelectItem value='ghdfsm'>
							Long location name blah blah blah
						</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<Tabs className='mt-8' defaultValue='week'>
				<TabsList>
					<TabsTrigger value='week'>Week</TabsTrigger>
					<TabsTrigger value='2week'>2 Weeks</TabsTrigger>
					<TabsTrigger value='month'>Month</TabsTrigger>
				</TabsList>
			</Tabs>
			<div className='h-[200px] mt-8'>
				<ResponsiveContainer width='100%' height='100%'>
					<BarChart
						data={data}
						margin={{
							left: -32,
						}}
					>
						<XAxis dataKey='name' />
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
		</div>
	);
}
