'use client';

import { Item } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';

export type Log = {
	user: string;
	date: number;
	change: number;
	newQuantity: number;
};

export const itemColumns: ColumnDef<Item>[] = [
	{ header: 'Expires', accessorKey: 'expires' },
	{ header: 'Quantity', accessorKey: 'quantity' },
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
