'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';

export type Log = {
	user: string;
	date: string;
	change: number;
	newQuantity: number;
};

export const columns: ColumnDef<Log>[] = [
	{ header: 'User', accessorKey: 'user' },
	{ header: 'Date', accessorKey: 'date' },
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
