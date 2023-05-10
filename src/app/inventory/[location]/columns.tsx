'use client';

import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export type Item = {
	location: string;
	uid: string;
	name: string;
	quantity: number;
};

export const columns: ColumnDef<Item>[] = [
	{ header: 'Item Name', accessorKey: 'name' },
	{ header: 'Quantity', accessorKey: 'quantity' },
	{
		header: 'Tags',
		cell: ({ row }: { row: any }) => (
			<>
				{row.original.quantity < 6 && (
					<Badge className='border-red-500 text-red-500' variant='outline'>
						Low
					</Badge>
				)}
			</>
		),
	},
	{
		header: 'Actions',
		cell: ({ row }: { row: any }) => {
			return (
				<div className='flex'>
					<Button variant='ghost' asChild>
						<Link
							href={`/inventory/${row.original.location}/${row.original.uid}`}
						>
							<Edit size={20} />
						</Link>
					</Button>
					<Button variant='ghost'>
						<Trash2 size={20} />
					</Button>
				</div>
			);
		},
	},
];
