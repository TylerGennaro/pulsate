import Header from '@components/ui/header';
import { Table, TableRow } from '@components/ui/table';
import { Check, X } from 'lucide-react';

const comparePlans = {
	perks: {
		'Inventory management': {
			Free: true,
			Manager: true,
			Executive: true,
		},
		'Expiration date tracking': {
			Free: true,
			Manager: true,
			Executive: true,
		},
		Locations: {
			Free: '1 location',
			Manager: '3 locations',
			Executive: '6 locations',
		},
		'Products per location': {
			Free: '20 products',
			Manager: '100 products',
			Executive: '300 products',
		},
		'Items per product *': {
			Free: '10 items',
			Manager: '20 items',
			Executive: '30 items',
		},
		'Activity log': {
			Free: false,
			Manager: 'Checkout activity log',
			Executive: 'Full activity log',
		},
		'Activity log entries': {
			Free: false,
			Manager: '50 log entries per product',
			Executive: '100 log entries per product',
		},
		'Printable QR Codes': {
			Free: false,
			Manager: true,
			Executive: true,
		},
		'Inventory notifications': {
			Free: false,
			Manager: true,
			Executive: true,
		},
		'Location sharing': {
			Free: false,
			Manager: false,
			Executive: true,
		},
	},
};

function PerkValue({ value }: { value: string | boolean }) {
	if (typeof value === 'boolean') {
		return value ? (
			<Check className='w-4 h-4 text-blue-700' />
		) : (
			<X className='w-4 h-4 text-muted-foreground' />
		);
	}
	return <span>{value}</span>;
}

function FeatureRow({
	feature,
	value,
	last,
}: {
	feature: string;
	last: boolean;
	value: {
		Free: string | boolean;
		Manager: string | boolean;
		Executive: string | boolean;
	};
}) {
	return (
		<TableRow>
			<td className='font-medium'>{feature}</td>
			{Object.entries(value).map(([key, value]) => (
				<td
					key={key}
					className={`p-4 ${
						key === 'Executive' ? 'border-x-2 border-x-blue-700' : ''
					} ${
						last && key === 'Executive'
							? 'block border-b-2 border-blue-700 rounded-b-md -mx-[1px]'
							: ''
					}`}
				>
					<PerkValue value={value} />
				</td>
			))}
		</TableRow>
	);
}

export default function CompareTable() {
	return (
		<div id='compare' className='flex flex-col w-full gap-4'>
			<Header className='mb-4'>Compare Plans</Header>
			<Table>
				<thead>
					<TableRow className='text-left [&>*]:py-4 [&>*:not(:first-of-type)]:px-4'>
						<th>Features</th>
						<th>Free</th>
						<th>Manager</th>
						<th className='block border-t-2 border-blue-700 border-x-2 -mx-[1px] rounded-t-md'>
							Executive
						</th>
					</TableRow>
				</thead>
				<tbody>
					{Object.entries(comparePlans.perks).map(
						([key, value], index, arr) => (
							<FeatureRow
								feature={key}
								value={value}
								last={index === arr.length - 1}
								key={key}
							/>
						)
					)}
				</tbody>
			</Table>
			<span className='max-w-screen-sm text-sm text-muted-foreground'>
				* Items are organized by expiration date per product. Items with the
				same expiration date are automatically combined to save space.
			</span>
		</div>
	);
}
