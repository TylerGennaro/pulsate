'use client';

import QRCode from '@components/QRCode';
import QrReader from '@components/QrReader';
import { Button } from '@components/ui/button';
import { DataTable } from '@components/ui/data-table';
import { DataTableFacetedFilter } from '@components/ui/data-table-faceted-filter';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';
import { Input } from '@components/ui/input';
import { toast } from '@components/ui/use-toast';
import { printQRCodes } from '@lib/qrcode';
import { tags } from '@lib/relations';
import { Product } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { Row, useReactTable } from '@tanstack/react-table';
import { Printer, ScanQrCode, Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { columns } from './columns';
import NewProduct from './NewProduct';
import { usePermissions } from '@context/permissionsContext';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useSearch } from '@components/SearchProvider';

function normalizeTags(value: string[]) {
	return [...new Set(value)].sort();
}

function printSelectedCodes(size: number, rows: Row<Product>[]) {
	const codes = rows.map(row => {
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
	locationId,
}: {
	table: ReturnType<typeof useReactTable<Product>>;
	locationId: string;
}) {
	const selectedRows = table.getFilteredSelectedRowModel().rows;
	const isFiltered =
		table.getPreFilteredRowModel().rows.length >
			table.getFilteredRowModel().rows.length ||
		table.getColumn('tags')?.getFilterValue() !== undefined;
	const router = useRouter();
	const permissions = usePermissions();
	const search = useSearch();
	const searchParams = useSearchParams();
	const tagsColumnFilter = table
		.getState()
		.columnFilters.find(filter => filter.id === 'tags')?.value;
	const selectedTags = useMemo(
		() => (Array.isArray(tagsColumnFilter) ? tagsColumnFilter : []),
		[tagsColumnFilter],
	);

	useEffect(() => {
		if (search) {
			table.getColumn('name')?.setFilterValue(search);
		} else {
			table.getColumn('name')?.setFilterValue('');
		}
	}, [search, table]);

	useEffect(() => {
		const tagsFromUrl = normalizeTags(searchParams.getAll('tags'));
		const currentTagsFilter = table.getColumn('tags')?.getFilterValue();
		const currentTags = normalizeTags(
			Array.isArray(currentTagsFilter) ? currentTagsFilter : [],
		);

		const isSameSelection =
			currentTags.length === tagsFromUrl.length &&
			currentTags.every((tag, index) => tag === tagsFromUrl[index]);

		if (!isSameSelection) {
			table
				.getColumn('tags')
				?.setFilterValue(tagsFromUrl.length ? tagsFromUrl : undefined);
		}
	}, [searchParams, table]);

	useEffect(() => {
		const selectedTagsNormalized = normalizeTags(selectedTags);
		const currentTagsInUrl = normalizeTags(searchParams.getAll('tags'));
		const hasSameTags =
			selectedTagsNormalized.length === currentTagsInUrl.length &&
			selectedTagsNormalized.every(
				(tag, index) => tag === currentTagsInUrl[index],
			);

		if (hasSameTags) {
			return;
		}

		const params = new URLSearchParams(searchParams.toString());
		params.delete('tags');
		selectedTagsNormalized.forEach(tag => params.append('tags', tag));

		const nextParams = params.toString();
		if (nextParams !== searchParams.toString()) {
			router.replace(`?${nextParams}`);
		}
	}, [router, searchParams, selectedTags]);

	const onScanSuccess = (result: string) => {
		const match = result.match(
			/^https:\/\/pulsate.cloud\/checkout\/([\w-]+)\/?$/,
		);
		if (match) {
			const id = match[1];
			router.push(`/app/${locationId}/${id}`);
		} else {
			toast.error('Could not find product.');
		}
	};

	const handleReset = () => {
		table.resetColumnFilters();
		router.replace(`/app/${locationId}`);
	};

	return (
		<div className='flex flex-wrap justify-between gap-4 mb-4'>
			<div className='flex flex-col justify-center flex-grow gap-4 lg:flex-row lg:items-center lg:justify-start'>
				<SearchBar />
				<div className='flex flex-wrap gap-2'>
					{table.getColumn('tags') && (
						<DataTableFacetedFilter
							column={table.getColumn('tags')}
							title='Tags'
							options={Object.values(tags).map(tag => ({
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
							onClick={handleReset}
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
					<Button className='whitespace-nowrap' icon={ScanQrCode}>
						Scan
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Scan QR Code</DialogTitle>
						<DialogDescription>
							Scan a QR code to view or edit the product.
						</DialogDescription>
					</DialogHeader>
					<QrReader onScanSuccess={onScanSuccess} />
				</DialogContent>
			</Dialog>
			<Dialog>
				<DialogTrigger asChild>
					<Button
						disabled={selectedRows.length === 0}
						className='whitespace-nowrap'
						icon={Printer}
					>
						Print {selectedRows.length > 0 ? selectedRows.length + ' ' : ''}
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
						onPrint={size => printSelectedCodes(size, selectedRows)}
						style={{
							container: 'flex flex-col items-center',
							button: 'self-end',
						}}
					/>
				</DialogContent>
			</Dialog>
			{locationId && permissions.has('product.create') && (
				<NewProduct location={locationId} />
			)}
		</div>
	);
}

function SearchBar() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const initialQuery = searchParams.get('q') ?? '';
	const [query, setQuery] = useState(initialQuery);

	useEffect(() => {
		setQuery(initialQuery);
	}, [initialQuery]);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setQuery(value);

		const params = new URLSearchParams(searchParams.toString());
		if (value) {
			params.set('q', value);
		} else {
			params.delete('q');
		}
		router.replace(`?${params.toString()}`);
	}

	return (
		<Input
			placeholder='Search products'
			className='max-w-xs'
			startIcon={<Search />}
			// value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
			// onChange={(event) =>
			// 	table.getColumn('name')?.setFilterValue(event.target.value)
			// }
			value={query}
			onChange={handleChange}
		/>
	);
}

export default function InventoryTable({ locationId }: { locationId: string }) {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['products', locationId],
		queryFn: async () => {
			const res = await fetch(`/api/products?location=${locationId}`);
			return res.json();
		},
	});
	return (
		<DataTable
			columns={columns}
			data={data ?? []}
			toolbar={({ table }) => <Toolbar table={table} locationId={locationId} />}
			isLoading={isLoading}
			enableSelection
			classNames={{ cell: 'p-3' }}
		/>
	);
}
