import ActivityTable from '@components/ActivityTable';

export default async function ActivityPage(
    props: {
        params: Promise<{ location: string }>;
    }
) {
    const params = await props.params;
    return <ActivityTable locationId={params.location} />;
}
