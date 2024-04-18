'use client';

import { Badge } from '@components/ui/badge';
import { DataTable } from '@components/ui/data-table';
import { formatDateTime } from '@lib/date';
import { templates } from '@lib/logTemplates';
import { LogType } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';

type ActivityLog = {
	id: string;
	user: {
		name: string;
		email: string;
	};
	product: {
		name: string;
		id: string;
	};
	type: LogType;
	timestamp: Date;
};

const columns: ColumnDef<ActivityLog>[] = [
	{
		header: 'User',
		accessorFn: (row) => row.user?.name ?? 'Guest',
	},
	{
		header: 'Product',
		accessorFn: (row) => row.product?.name,
	},
	{
		header: 'Type',
		accessorKey: 'type',
		cell: ({ row }) => {
			const Icon = templates[row.original.type].icon;
			return (
				<Badge variant='outline' className='py-1'>
					{<Icon className='icon-left' />}
					{templates[row.original.type].badge.text}
				</Badge>
			);
		},
	},
	{
		header: 'Timestamp',
		accessorKey: 'timestamp',
		cell: ({ row }) => formatDateTime(new Date(row.original.timestamp)),
	},
];

export default function ActivityTable({ locationId }: { locationId: string }) {
	const { data, isLoading } = useQuery({
		queryKey: ['activity', locationId],
		queryFn: async () => {
			const response = await fetch(
				`/api/locations/activity?location=${locationId}`
			);
			return response.json();
		},
	});
	const [page, setPage] = useState(1);
	const PER_PAGE = 20;
	return (
		<DataTable
			columns={columns}
			data={data ?? []}
			isLoading={isLoading}
			onRowClick={(row) => {
				console.log(row);
			}}
			classNames={{ cell: 'p-2' }}
		/>
	);
}
