import InventoryTable from '@components/location/InventoryTable';

export default async function Page(
    props: {
        params: Promise<{ location: string }>;
    }
) {
    const params = await props.params;
    return <InventoryTable locationId={params.location} />;
}
