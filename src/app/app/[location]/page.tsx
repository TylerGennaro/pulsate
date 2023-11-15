import InventoryTable from './(components)/InventoryTable';
import { Button } from '@components/ui/button';
import { ScrollText } from 'lucide-react';
import NewProduct from './(components)/NewProduct';
import Link from 'next/link';
import { db } from '@lib/prisma';
import EditLocation from './(components)/EditLocation';
import { Suspense } from 'react';
import TableLoading from './(components)/TableLoading';
import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/auth';
import SignIn from '@components/SignIn';
import { notFound } from 'next/navigation';
import Container from '@components/Container';
import { populateMetadata } from '@lib/utils';

export async function generateMetadata({
	params,
}: {
	params: { location: string };
}) {
	const { name, userId } = await getLocationInfo(params.location);
	return populateMetadata(name!);
}

async function getLocationInfo(id: string) {
	const data = await db.location.findFirst({
		select: {
			name: true,
			userId: true,
		},
		where: {
			id,
		},
	});
	return { name: data?.name, userId: data?.userId };
}

export default async function Inventory({
	params,
}: {
	params: { location: string };
}) {
	const session = await getServerSession(authOptions);
	if (!session) return <SignIn />;
	const { name, userId } = await getLocationInfo(params.location);
	if (userId !== session.user.id) return notFound();

	return (
		<Container
			header={name}
			description={`Managed by ${session.user.name}`}
			divider
		>
			<div className='flex flex-wrap items-center gap-2 mb-4'>
				<NewProduct location={params.location} />
				<EditLocation name={name!} id={params.location} />
				<Link href={`/app/${params.location}/activity`}>
					<Button variant='outline'>
						<ScrollText className='w-4 h-4 mr-2' />
						Activity
					</Button>
				</Link>
			</div>
			<Suspense fallback={<TableLoading />}>
				{/* @ts-ignore */}
				<InventoryTable id={params.location} />
			</Suspense>
		</Container>
	);
}
