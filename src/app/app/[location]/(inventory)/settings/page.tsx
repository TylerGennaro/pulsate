import SettingsPage from '@components/location/settings/SettingsPage';

export default function Page({ params }: { params: { location: string } }) {
	return <SettingsPage locationId={params.location} />;
}
