import {
	Bar,
	BarChart as RechartsBarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

type BarChartProps = {
	data: any[];
	xAxisKey: string;
};

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

export default function BarChart({ data, xAxisKey }: BarChartProps) {
	if (data.length === 0)
		return (
			<div className='grid w-full h-full place-content-center'>
				No data available.
			</div>
		);
	return (
		<ResponsiveContainer width='100%' height='100%'>
			<RechartsBarChart
				data={data}
				margin={{
					left: -32,
				}}
			>
				<defs>
					<linearGradient id='primaryGradient' x1='0' y1='0' x2='0' y2='1'>
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
				<XAxis dataKey={xAxisKey} />
				<YAxis allowDecimals={false} />
				<Tooltip
					cursor={{ fill: 'hsl(var(--muted))', radius: 4 }}
					content={<CustomTooltip />}
					isAnimationActive={false}
				/>
				<Bar
					dataKey='quantity'
					fill="url('#primaryGradient')"
					stroke='hsl(var(--primary))'
					strokeOpacity={0.4}
					maxBarSize={64}
				/>
			</RechartsBarChart>
		</ResponsiveContainer>
	);
}
