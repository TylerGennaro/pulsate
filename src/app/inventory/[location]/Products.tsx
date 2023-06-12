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

function printSelectedCodes(rows: Row<Product>[]) {
	const codes = rows.map((row) => {
		return {
			location: row.original.locationId,
			id: row.original.id,
			name: row.original.name,
		};
	});
	printQRCodes(codes);
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
		<div className='mb-4 flex justify-between gap-4 flex-wrap'>
			<div className='flex flex-col justify-center gap-4 lg:flex-row lg:items-center lg:justify-start flex-grow'>
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
							<X className='ml-2 h-4 w-4' />
						</Button>
					)}
				</div>
			</div>
			<Button
				disabled={selectedRows.length === 0}
				onClick={() => printSelectedCodes(selectedRows)}
				className='whitespace-nowrap'
			>
				Print {selectedRows.length > 0 ? selectedRows.length + ' ' : ''}QR
				Code(s)
			</Button>
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
