'use client';

import { Badge } from '@components/ui/badge';
import { formatDate, isExpiring } from '@lib/date';
import { Tag } from '@lib/enum';
import { tags } from '@lib/tags';
import { Item } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import EditItem from './EditItem';

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
			return <p>{formatDate(row.original.expires)}</p>;
		},
	},
	{ header: 'Quantity', accessorKey: 'quantity' },
	{
		header: 'Tags',
		cell: ({ row }: { row: any }) => {
			const t = [];
			if (isExpiring(row.original.expires)) t.push(Tag.EXPIRES);
			if (row.original.onOrder) t.push(Tag.ONORDER);
			if (t.length === 0) return <Badge variant='outline'>None</Badge>;
			return (
				<div className='flex gap-2 flex-wrap'>
					{t.map((tag) => {
						const data = tags[tag];
						return (
							<Badge variant='outline' color={data.color} key={data.value}>
								{data.label}
							</Badge>
						);
					})}
				</div>
			);
		},
	},
	{
		id: 'actions',
		cell: ({ row }: { row: { original: Item } }) => {
			return <EditItem item={row.original} />;
		},
	},
];

export const columns: ColumnDef<Log>[] = [
	{ header: 'User', accessorKey: 'user' },
	{
		header: 'Date',
		accessorKey: 'date',
		cell: ({ row }: { row: any }) => {
			const date = new Date(row.original.date);
			return (
				<div className='flex flex-col'>
					<span>
						{`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`}
					</span>
					<span className='text-xs text-muted-foreground'>{` ${
						date.getHours() % 12
					}:${date.getMinutes()} ${date.getHours() >= 12 ? 'PM' : 'AM'}`}</span>
				</div>
			);
		},
	},
	{
		header: 'Change',
		cell: ({ row }: { row: any }) => {
			return (
				<>
					{row.original.change > 0 ? (
						<div className='flex text-green-500'>
							<ArrowUp />
							<span>{row.original.change}</span>
						</div>
					) : (
						<div className='flex text-red-500'>
							<ArrowDown />
							<span>{Math.abs(row.original.change)}</span>
						</div>
					)}
				</>
			);
		},
	},
	{ header: 'New Quantity', accessorKey: 'newQuantity' },
];
