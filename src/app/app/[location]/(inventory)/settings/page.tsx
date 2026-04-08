import SettingsPage from '@components/location/settings/SettingsPage';

export default async function Page(props: { params: Promise<{ location: string }> }) {
    const params = await props.params;
    return <SettingsPage locationId={params.location} />;
}
