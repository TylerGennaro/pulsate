'use client';

import { formatUTCDate, isExpiring } from '@lib/date';
import { Tag } from '@lib/enum';
import { Item } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import EditItem from '../../../../components/product/EditItem';
import TagBadge from '@components/TagBadge';
import ItemArrived from '../../../../components/product/ItemArrived';

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
			return <p>{formatUTCDate(row.original.expires)}</p>;
		},
	},
	{ header: 'Quantity', accessorKey: 'quantity' },
	{
		header: 'Tags',
		cell: ({ row }: { row: any }) => {
			const tags = [];
			if (isExpiring(row.original.expires)) tags.push(Tag.EXPIRES);
			if (row.original.onOrder) tags.push(Tag.ONORDER);
			if (tags.length === 0) return <TagBadge tag={Tag.NONE} />;
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
				<div className='flex justify-end gap-2'>
					{row.original.onOrder && <ItemArrived item={row.original} />}
					<EditItem item={row.original} />
				</div>
			);
		},
	},
];
