'use client';

import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { tags } from './data';

export type Item = {
	location: string;
	uid: string;
	name: string;
	quantity: number;
	tags?: string[];
};

export const columns: ColumnDef<Item>[] = [
	{ header: 'Item Name', accessorKey: 'name' },
	{ header: 'Quantity', accessorKey: 'quantity' },
	{
		header: 'Tags',
		accessorKey: 'tags',
		cell: ({ row }: { row: any }) => {
			const formattedTags = tags.filter((tag) =>
				row.original.tags?.includes(tag.value)
			);
			return (
				<div className='flex flex-wrap gap-2'>
					{formattedTags.map((tag) => (
						<Badge
							key={tag.label}
							className={`border-${tag.color} text-${tag.color}`}
							variant='outline'
						>
							{tag.label}
						</Badge>
					))}
				</div>
			);
		},
		filterFn: (row, id, filterValue) => {
			return (
				filterValue.filter((value: string) =>
					row.original.tags?.includes(value)
				).length > 0
			);
		},
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
