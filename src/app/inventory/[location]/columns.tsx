'use client';

import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { tags } from '@lib/tags';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTrigger,
	AlertDialogCancel,
	AlertDialogDescription,
	AlertDialogTitle,
} from '@components/ui/alert-dialog';
import { deleteProduct } from '@actions/products';
import { handleResponse } from '@lib/actionResponse';
import { Tag } from '@lib/enum';
import { formatDate } from '@lib/date';
import EditProduct from './EditProduct';

export const columns = (userID: string): ColumnDef<ProductInfo>[] => [
	{ header: 'Product Name', accessorKey: 'name' },
	{
		header: 'Quantity',
		accessorKey: 'quantity',
		cell: ({ row }: { row: any }) => (
			<span>
				{row.original.quantity}
				{row.original.max && (
					<span className='text-xs text-muted-foreground ml-1'>
						{'/'}
						{row.original.max || ''}
					</span>
				)}
			</span>
		),
	},
	{
		header: 'Earliest Expiration',
		accessorKey: 'exp',
		cell: ({ row }: { row: any }) => {
			return <p>{formatDate(row.original.exp) || 'None'}</p>;
		},
	},
	{
		header: 'Tags',
		accessorKey: 'tags',
		cell: ({ row }: { row: any }) => {
			const formattedTags = row.original.tags.map((tag: Tag) => tags[tag]);
			return (
				<div className='flex flex-wrap gap-2'>
					{formattedTags.map((tag: any) => (
						<Badge key={tag.label} color={tag.color} variant='outline'>
							{tag.label}
						</Badge>
					))}
				</div>
			);
		},
		filterFn: (row, id, filterValue) => {
			return (
				filterValue.filter((value: string) => {
					const values = row.original.tags.map((tag: Tag) => tags[tag].value);
					return values.includes(value);
				}).length > 0
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
							href={`/inventory/${row.original.locationId}/${row.original.id}`}
						>
							<Eye size={20} />
						</Link>
					</Button>
					<EditProduct id={row.original.id} name={row.original.name} />
				</div>
			);
		},
	},
];
