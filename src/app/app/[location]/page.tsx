import Container from '@components/Container';
import SignIn from '@components/SignIn';
import EditLocation from '@components/location/EditLocation';
import InventoryTable from '@components/location/InventoryTable';
import NewProduct from '@components/location/NewProduct';
import { Button } from '@components/ui/button';
import { authOptions } from '@lib/auth';
import { fetchLocationInfo } from '@lib/data';
import { populateMetadata } from '@lib/utils';
import { ScrollText } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
	const session = await getServerSession(authOptions);
	if (!session) return <SignIn />;
	const { name, userId, userName } = await fetchLocationInfo(params.location);
	if (!name) return notFound();
	if (userId !== session.user.id) return notFound();

	return (
		<Container
			header={name}
			description={`Managed by ${userName ?? 'Unknown User'}`}
			action={<EditLocation name={name} id={params.location} />}
			divider
		>
			<div className='flex flex-wrap items-center gap-2 mb-4'>
				<NewProduct location={params.location} />
				<Link href={`/app/${params.location}/activity`}>
					<Button variant='outline'>
						<ScrollText className='w-4 h-4 mr-2' />
						Activity
					</Button>
				</Link>
			</div>
			<InventoryTable location={params.location} />
		</Container>
	);
}
