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
			className='pl-0 font-medium hover:bg-transparent dark:hover:bg-transparent'
		>
			{header}
			{sort === false && (
				<ChevronsUpDown className='icon-right text-muted-foreground' />
			)}
			{sort === 'asc' && (
				<ChevronUp className='icon-right text-muted-foreground' />
			)}
			{sort === 'desc' && (
				<ChevronDown className='icon-right text-muted-foreground' />
			)}
		</Button>
	);
}
