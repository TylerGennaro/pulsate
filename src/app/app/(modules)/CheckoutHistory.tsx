'use client';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { CSSProperties } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

/*
const data = [
	{
		name: 'Location 1',
		week: [
			{
				name: 'Cervical Collar',
				quantity: 10,
				weekday: 'Sun',
			},
			{
				name: 'Cervical Collar',
				quantity: 8,
				weekday: 'Mon',
			},
			{
				name: 'Cervical Collar',
				quantity: 8,
				weekday: 'Tue',
			},
			{
				name: 'Cervical Collar',
				quantity: 8,
				weekday: 'Wed',
			},
			{
				name: 'Cervical Collar',
				quantity: 7,
				weekday: 'Thu',
			},
			{
				name: 'Cervical Collar',
				quantity: 5,
				weekday: 'Fri',
			},
			{
				name: 'Cervical Collar',
				quantity: 8,
				weekday: 'Sat',
			}
		],
		biweek: [

		],
		month: [

		]
	}
]
*/

const data = [
	{
		name: 'Cervical Collar',
		quantity: 10,
		weekday: 'Sun',
	},
	{
		name: 'Cervical Collar',
		quantity: 8,
		weekday: 'Mon',
	},
	{
		name: 'Cervical Collar',
		quantity: 8,
		weekday: 'Tue',
	},
	{
		name: 'Cervical Collar',
		quantity: 8,
		weekday: 'Wed',
	},
	{
		name: 'Cervical Collar',
		quantity: 7,
		weekday: 'Thu',
	},
	{
		name: 'Cervical Collar',
		quantity: 5,
		weekday: 'Fri',
	},
	{
		name: 'Cervical Collar',
		quantity: 8,
		weekday: 'Sat',
	},
];

export default function CheckoutHistory() {
	const { data } = useQuery({
		queryKey: ['checkout-history'],
		queryFn: async () => {
			const results = await fetch('/api/locations/stats');
			return results.json();
		},
	});
	console.log(data);
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
						<XAxis dataKey='weekday' />
						<YAxis />
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
