import ActivityTable from '@components/ActivityTable';

export default function ActivityPage({
	params,
}: {
	params: { location: string };
}) {
	return <ActivityTable locationId={params.location} />;
}
