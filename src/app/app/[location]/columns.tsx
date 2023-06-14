'use client';

import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, MoreVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { packageTypes, tags } from '@lib/relations';
import { PackageType, Tag } from '@lib/enum';
import { formatDate } from '@lib/date';
import EditProduct from './EditProduct';
import TagBadge from '@components/TagBadge';

export const columns: ColumnDef<ProductInfo>[] = [
	{ header: 'Product Name', accessorKey: 'name' },
	{
		header: 'Quantity',
		accessorKey: 'quantity',
		cell: ({ row }: { row: any }) => (
			<span>
				{row.original.quantity}{' '}
				{packageTypes[row.original.package as PackageType]}
				{row.original.max && row.original.max > 0 ? (
					<span className='ml-1 text-xs text-muted-text'>
						{'/ '}
						{row.original.max || ''}
					</span>
				) : null}
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
			return (
				<div className='flex flex-wrap gap-2'>
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
		header: 'Actions',
		cell: ({ row }: { row: any }) => {
			return (
				<div className='flex'>
					<Button variant='ghost' asChild>
						<Link href={`/app/${row.original.locationId}/${row.original.id}`}>
							<Eye size={20} />
						</Link>
					</Button>
					<EditProduct
						id={row.original.id}
						defaultValues={{
							name: row.original.name,
							min: row.original.min,
							max: row.original.max,
							packageType: row.original.package,
						}}
					>
						<Button variant='ghost'>
							<span className='sr-only'>Open menu</span>
							<MoreVertical size={20} />
						</Button>
					</EditProduct>
				</div>
			);
		},
	},
];
