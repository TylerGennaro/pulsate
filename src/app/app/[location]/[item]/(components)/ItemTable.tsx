import { DataTable } from '@components/ui/data-table';
import { Item } from '@prisma/client';
import { itemColumns } from '../columns';

export default function ItemTable({ data }: { data: Item[] }) {
	return <DataTable data={data} columns={itemColumns} />;
}
