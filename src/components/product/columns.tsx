'use client';

import { formatUTCDate, isExpired } from '@lib/date';
import { Tag } from '@lib/enum';
import { Item } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import EditItem from './EditItem';
import TagBadge from '@components/TagBadge';
import ItemArrived from './ItemArrived';

export type Log = {
	user: string;
	date: number;
	change: number;
	newQuantity: number;
};

export const itemColumns: ColumnDef<Item>[] = [
	{
		header: 'Expires',
		accessorKey: 'expires',
		cell: ({ row }: { row: any }) => {
			if (row.original.expires === null) return <p>Never</p>;
			return <p className='w-max'>{formatUTCDate(row.original.expires)}</p>;
		},
	},
	{ header: 'Quantity', accessorKey: 'quantity' },
	{
		header: 'Tags',
		cell: ({ row }: { row: any }) => {
			const tags = [];
			if (isExpired(row.original.expires)) tags.push(Tag.EXPIRES);
			if (row.original.onOrder) tags.push(Tag.ONORDER);
			return (
				<div className='flex flex-wrap gap-2'>
					{tags.map((tag) => {
						return <TagBadge tag={tag} key={tag} />;
					})}
				</div>
			);
		},
	},
	{
		id: 'actions',
		cell: ({ row }: { row: { original: Item } }) => {
			return (
				<div className='flex items-center justify-end gap-2'>
					{row.original.onOrder && <ItemArrived item={row.original} />}
					<EditItem item={row.original} />
				</div>
			);
		},
	},
];
