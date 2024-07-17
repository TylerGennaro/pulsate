import ActivityTable from '@components/ActivityTable';
import Container from '@components/Container';
import InventoryTable from '@components/location/InventoryTable';
import LocationHeader from '@components/location/LocationHeader';
import SettingsPage from '@components/location/settings/SettingsPage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { fetchLocationInfo } from '@lib/data';
import { populateMetadata } from '@lib/utils';

export async function generateMetadata({
	params,
}: {
	params: { location: string };
}) {
	const { name } = await fetchLocationInfo(params.location);
	return populateMetadata(name ?? 'Unknown Location');
}

export default async function Inventory({
	params,
}: {
	params: { location: string };
}) {
	return (
		<>
			<LocationHeader location={params.location} />
			<Container>
				<Tabs defaultValue='products'>
					<TabsList>
						<TabsTrigger value='products'>Products</TabsTrigger>
						<TabsTrigger value='activity'>Activity</TabsTrigger>
						<TabsTrigger value='settings'>Settings</TabsTrigger>
					</TabsList>
					<TabsContent value='products' className='pt-8'>
						<InventoryTable location={params.location} />
					</TabsContent>
					<TabsContent value='activity' className='pt-8'>
						<ActivityTable locationId={params.location} />
					</TabsContent>
					<TabsContent value='settings' className='pt-8'>
						<SettingsPage locationId={params.location} />
					</TabsContent>
				</Tabs>
			</Container>
		</>
	);
}
