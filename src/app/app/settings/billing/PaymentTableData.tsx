'use client';

import { DataTable } from '@components/ui/data-table';
import { columns } from './columns';

export default function PaymentTableData({
	payments,
}: {
	payments: PopulatedPayment[];
}) {
	return <DataTable columns={columns} data={payments} />;
}
