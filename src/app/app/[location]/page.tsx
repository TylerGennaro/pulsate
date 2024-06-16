import Container from '@components/Container';
import ActivityTable from '@components/ActivityTable';
import InventoryTable from '@components/location/InventoryTable';
import LocationHeader from '@components/location/LocationHeader';
import NewProduct from '@components/location/NewProduct';
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
		<Container>
			<LocationHeader location={params.location} />
			<Tabs defaultValue='products' className='mt-8'>
				<TabsList>
					<TabsTrigger value='products'>Products</TabsTrigger>
					<TabsTrigger value='activity'>Activity</TabsTrigger>
					<TabsTrigger value='settings'>Settings</TabsTrigger>
				</TabsList>
				<TabsContent value='products' className='pt-8'>
					<div className='flex justify-end mb-4'>
						<NewProduct location={params.location} />
					</div>
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
	);
}
