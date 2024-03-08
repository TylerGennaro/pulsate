import { Button } from '@components/ui/button';
import { ScrollText } from 'lucide-react';
import Link from 'next/link';
import { db } from '@lib/prisma';
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/auth';
import SignIn from '@components/SignIn';
import { notFound } from 'next/navigation';
import Container from '@components/Container';
import { populateMetadata } from '@lib/utils';
import NewProduct from '@components/location/NewProduct';
import EditLocation from '@components/location/EditLocation';
import { fetchLocationInfo } from '@lib/data';
import InventoryTable from '@components/location/InventoryTable';

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
	const { name, userId } = await fetchLocationInfo(params.location);
	if (!name) return notFound();
	if (userId !== session.user.id) return notFound();

	return (
		<Container
			header={name}
			description={`Managed by ${session.user.name}`}
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
