'use client';

import ArrowButton from '@components/ArrowButton';
import DataTableSortableHeader from '@components/DataTableSortableHeader';
import TagBadge from '@components/TagBadge';
import { Button } from '@components/ui/button';
import { formatUTCDate } from '@lib/date';
import { PackageType, Tag } from '@lib/enum';
import { packageTypes, tags } from '@lib/relations';
import { ColumnDef } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';
import Link from 'next/link';
import EditProduct from './EditProduct';

export const columns: ColumnDef<ProductListing>[] = [
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
			</span>
		),
	},
	{
		header: ({ column }) => (
			<DataTableSortableHeader column={column} header='Expiration' />
		),
		accessorKey: 'exp',
		cell: ({ row }: { row: { original: ProductListing } }) => {
			return (
				<p className='text-muted-foreground'>
					{row.original.exp > 0
						? formatUTCDate(new Date(row.original.exp))
						: 'None'}
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
		cell: ({ row }: { row: { original: ProductListing } }) => {
			return (
				<div className='flex gap-1'>
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
		cell: ({ row }: { row: { original: ProductListing } }) => {
			return (
				<Link href={`/app/${row.original.locationId}/${row.original.id}`}>
					<ArrowButton size='sm'>View</ArrowButton>
				</Link>
			);
		},
	},
];
