import { Badge } from '@components/ui/badge';
import { formatDate } from '@lib/date';
import { Payment } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { Check, X } from 'lucide-react';

export const columns: ColumnDef<PopulatedPayment>[] = [
	{
		header: 'Date',
		accessorFn: (date) => formatDate(new Date(date.created * 1000)),
	},
	{
		header: 'Amount',
		accessorFn: (payment) =>
			new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			}).format(payment.amount / 100),
	},
	{
		header: 'Status',
		accessorKey: 'status',
		cell: ({ row }: { row: any }) => (
			<Badge
				color={row.original.status === 'Paid' ? 'green' : 'red'}
				variant='ghost'
			>
				{row.original.status === 'Paid' ? (
					<Check className='mr-1 icon-left' />
				) : (
					<X className='mr-1 icon-left' />
				)}
				{row.original.status}
			</Badge>
		),
	},
];
