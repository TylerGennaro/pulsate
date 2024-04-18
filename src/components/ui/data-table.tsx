'use client';

import {
	ColumnDef,
	ColumnFiltersState,
	Row,
	SortingState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';

import { Checkbox } from '@components/ui/checkbox';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@components/ui/table';
import { useState } from 'react';
import { Skeleton } from './skeleton';
import { cn } from '@lib/utils';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	enableSelection?: boolean;
	toolbar?: ({ table }: { table: any }) => JSX.Element;
	isLoading?: boolean;
	onRowClick?: (row: Row<TData>) => void;
	classNames?: {
		table?: string;
		header?: {
			container?: string;
			row?: string;
			cell?: string;
		};
		row?: string;
		cell?: string;
	};
}

export function DataTable<TData, TValue>({
	columns,
	data,
	enableSelection,
	toolbar,
	isLoading,
	onRowClick,
	classNames,
}: DataTableProps<TData, TValue>) {
	const [rowSelection, setRowSelection] = useState({});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);

	if (enableSelection && !columns.find((column) => column.id === 'select')) {
		columns.unshift({
			id: 'select',
			header: ({ table }) => (
				<Checkbox
					checked={table.getIsAllPageRowsSelected()}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label='Select all'
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label='Select row'
				/>
			),
			enableSorting: false,
			enableHiding: false,
		});
	}

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onRowSelectionChange: setRowSelection,
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		state: {
			rowSelection,
			columnFilters,
			sorting,
		},
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<div>
			{toolbar && toolbar({ table })}
			<div className='rounded-md'>
				<Table className={classNames?.table}>
					<TableHeader className={classNames?.header?.container}>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className={classNames?.header?.row}
							>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className={classNames?.header?.cell}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<>
								{Array.from({ length: 10 }).map((_, index) => (
									<TableRow key={index}>
										{columns.map((column, i) => (
											<TableCell key={i}>
												<Skeleton className='w-full h-6' />
											</TableCell>
										))}
									</TableRow>
								))}
							</>
						) : (
							<>
								{table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map((row) => (
										<TableRow
											key={row.id}
											data-state={row.getIsSelected() && 'selected'}
											onClick={() => onRowClick?.(row)}
											className={cn(
												classNames?.row,
												onRowClick
													? 'cursor-pointer hover:bg-muted transition-colors'
													: ''
											)}
										>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id} className={classNames?.cell}>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
													)}
												</TableCell>
											))}
										</TableRow>
									))
								) : (
									<TableRow className={classNames?.row}>
										<TableCell
											colSpan={columns.length}
											className={cn(classNames?.cell, 'h-24 text-center')}
										>
											No results.
										</TableCell>
									</TableRow>
								)}
							</>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
