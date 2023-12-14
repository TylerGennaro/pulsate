'use client';

import { Button } from '@components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDown, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { packageTypes, tags } from '@lib/relations';
import { PackageType, Tag } from '@lib/enum';
import { formatDate } from '@lib/date';
import EditProduct from './(components)/EditProduct';
import TagBadge from '@components/TagBadge';
import DataTableSortableHeader from '@components/DataTableSortableHeader';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';

export const columns: ColumnDef<ProductInfo>[] = [
	{
		header: ({ column }) => (
			<DataTableSortableHeader column={column} header='Name' />
		),
		invertSorting: true,
		accessorKey: 'name',
	},
	{
		header: ({ column }) => (
			<DataTableSortableHeader column={column} header='Quantity' />
		),
		accessorKey: 'quantity',
		cell: ({ row }: { row: any }) => (
			<span className='text-muted-foreground'>
				{row.original.quantity}{' '}
				{packageTypes[row.original.package as PackageType]}
				{row.original.max && row.original.max > 0 ? (
					<span className='ml-1 text-xs text-muted-foreground'>
						{'/ '}
						{row.original.max || ''}
					</span>
				) : null}
			</span>
		),
	},
	{
		header: ({ column }) => (
			<DataTableSortableHeader column={column} header='Expiration' />
		),
		accessorKey: 'exp',
		cell: ({ row }: { row: any }) => {
			return (
				<p className='text-muted-foreground'>
					{row.original.exp > 0 ? formatDate(row.original.exp) : 'None'}
				</p>
			);
		},
		sortingFn: (rowA, rowB, columnId) => {
			const a = rowA.original.exp;
			const b = rowB.original.exp;
			if (a === b) return 0;
			if (a === 0) return 1;
			if (b === 0) return -1;
			return a < b ? -1 : 1;
		},
	},
	{
		header: 'Tags',
		accessorKey: 'tags',
		cell: ({ row }: { row: any }) => {
			return (
				<div className='flex flex-col gap-2'>
					{row.original.tags.map((tag: any) => (
						<TagBadge tag={tag} key={tag} />
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
		id: 'actions',
		cell: ({ row }: { row: any }) => {
			return (
				<div className='flex gap-2'>
					<Button variant='outline' asChild>
						<Link href={`/app/${row.original.locationId}/${row.original.id}`}>
							View
						</Link>
					</Button>
					<EditProduct
						id={row.original.id}
						defaultValues={{
							name: row.original.name,
							min: row.original.min,
							max: row.original.max,
							packageType: row.original.package,
							position: row.original.position,
							url: row.original.url,
						}}
					>
						<Button variant='ghost'>
							{/* <span className='sr-only'>Open menu</span> */}
							<MoreVertical size={20} />
						</Button>
					</EditProduct>
				</div>
			);
		},
	},
];
