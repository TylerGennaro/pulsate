import ActivityTable from '@components/ActivityTable';
import InventoryTable from '@components/location/InventoryTable';

export default function Page({ params }: { params: { location: string } }) {
	return <InventoryTable location={params.location} />;
}
