'use client';

import { CSSProperties } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

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

export default function Chart() {
	return (
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
	);
}
