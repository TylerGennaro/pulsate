'use client';

import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
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

export const columns = (userID: string): ColumnDef<ProductInfo>[] => [
	{ header: 'Product Name', accessorKey: 'name' },
	{
		header: 'Quantity',
		accessorKey: 'quantity',
		cell: ({ row }: { row: any }) => (
			<p>
				{row.original.quantity}/{row.original.max || ''}
			</p>
		),
	},
	{
		header: 'Earliest Expiration',
		accessorKey: 'exp',
		cell: ({ row }: { row: any }) => {
			return <p>{formatDate(row.original.exp)}</p>;
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
							<Edit size={20} />
						</Link>
					</Button>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant='ghost'>
								<Trash2 size={20} />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<form
								action={(data: FormData) => {
									deleteProduct(row.original.id, userID).then((res) => {
										handleResponse(res);
									});
								}}
							>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This item and all its data
										will be removed from the system.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<Button type='submit' variant='destructive'>
										Delete
									</Button>
								</AlertDialogFooter>
							</form>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			);
		},
	},
];
