'use client';

import { DataTable } from '@components/ui/data-table';
import { columns } from './columns';
import { Row, useReactTable } from '@tanstack/react-table';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { printQRCodes } from '@lib/qrcode';
import { DataTableFacetedFilter } from '@components/ui/data-table-faceted-filter';
import { tags } from '@lib/relations';
import { X } from 'lucide-react';
import { Product } from '@prisma/client';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';
import QRCode from '@components/QRCode';

function printSelectedCodes(size: number, rows: Row<Product>[]) {
	const codes = rows.map((row) => {
		return {
			location: row.original.locationId,
			id: row.original.id,
			name: row.original.name,
		};
	});
	printQRCodes(size, codes);
}

function Toolbar({
	table,
}: {
	table: ReturnType<typeof useReactTable<Product>>;
}) {
	const selectedRows = table.getFilteredSelectedRowModel().rows;
	const isFiltered =
		table.getPreFilteredRowModel().rows.length >
		table.getFilteredRowModel().rows.length;

	return (
		<div className='flex flex-wrap justify-between gap-4 mb-4'>
			<div className='flex flex-col justify-center flex-grow gap-4 lg:flex-row lg:items-center lg:justify-start'>
				<Input
					placeholder='Search products'
					className='max-w-xs'
					value={table.getColumn('name')?.getFilterValue() as string}
					onChange={(event) =>
						table.getColumn('name')?.setFilterValue(event.target.value)
					}
				/>
				<div className='flex flex-wrap gap-2'>
					{table.getColumn('tags') && (
						<DataTableFacetedFilter
							column={table.getColumn('tags')}
							title='Tags'
							options={Object.values(tags).map((tag) => ({
								value: tag.value,
								label: tag.label,
								icon: tag.icon || undefined,
								color: tag.color,
							}))}
						/>
					)}
					{isFiltered && (
						<Button
							variant='ghost'
							onClick={() => table.resetColumnFilters()}
							className='h-8 px-2 lg:px-3'
						>
							Reset
							<X className='w-4 h-4 ml-2' />
						</Button>
					)}
				</div>
			</div>
			<Dialog>
				<DialogTrigger asChild>
					<Button
						disabled={selectedRows.length === 0}
						// onClick={() => printSelectedCodes(selectedRows)}
						className='whitespace-nowrap'
					>
						Print {selectedRows.length > 0 ? selectedRows.length + ' ' : ''}QR
						Code(s)
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Print QR Codes</DialogTitle>
						<DialogDescription>
							Set the size of selected QR codes and print them.
						</DialogDescription>
					</DialogHeader>
					<hr />
					<QRCode
						id={selectedRows[0]?.original.id || ''}
						location={selectedRows[0]?.original.locationId || ''}
						onPrint={(size) => printSelectedCodes(size, selectedRows)}
						style={{
							container: 'flex flex-col items-center',
							button: 'self-end',
						}}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default function Products({ data }: { data: ProductInfo[] }) {
	return (
		<DataTable
			columns={columns}
			data={data!}
			toolbar={Toolbar}
			enableSelection
		/>
	);
}
