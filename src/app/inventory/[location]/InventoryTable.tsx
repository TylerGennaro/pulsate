'use client';

import { DataTable } from '@components/ui/data-table';
import { columns, Item } from './columns';
import { Row, useReactTable } from '@tanstack/react-table';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { printQRCodes } from '@lib/qrcode';

interface InventoryTableProps {
	data: Item[];
}

function printSelectedCodes(rows: Row<Item>[]) {
	const codes = rows.map((row) => {
		return {
			location: row.original.location,
			uid: row.original.uid,
			name: row.original.name,
		};
	});
	printQRCodes(codes);
}

function Toolbar({ table }: { table: ReturnType<typeof useReactTable<Item>> }) {
	const selectedRows = table.getFilteredSelectedRowModel().rows;
	return (
		<div className='mb-4 flex justify-between gap-4'>
			<Button
				disabled={selectedRows.length === 0}
				onClick={() => printSelectedCodes(selectedRows)}
				className='whitespace-nowrap'
			>
				Print {selectedRows.length > 0 ? selectedRows.length + ' ' : ''}QR
				Code(s)
			</Button>
			<Input
				placeholder='Filter items'
				className='max-w-xs'
				value={table.getColumn('name')?.getFilterValue() as string}
				onChange={(event) =>
					table.getColumn('name')?.setFilterValue(event.target.value)
				}
			/>
		</div>
	);
}

export default function InventoryTable({ data }: InventoryTableProps) {
	return (
		<div>
			<DataTable
				columns={columns}
				data={data}
				toolbar={Toolbar}
				enableSelection
			/>
		</div>
	);
}
