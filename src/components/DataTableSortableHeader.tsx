import { Column } from '@tanstack/react-table';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

export default function DataTableSortableHeader({
	column,
	header,
}: {
	column: Column<any>;
	header: string;
}) {
	const sort = column.getIsSorted();
	return (
		<Button
			variant='ghost'
			onClick={() => column.toggleSorting(undefined)}
			className='font-medium'
		>
			{header}
			{sort === false && <ChevronsUpDown className='icon-right' />}
			{sort === 'asc' && <ChevronUp className='icon-right' />}
			{sort === 'desc' && <ChevronDown className='icon-right' />}
		</Button>
	);
}
