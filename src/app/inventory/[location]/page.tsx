import InventoryTable from './InventoryTable';
import { Button } from '@components/ui/button';
import { ChevronLeft } from 'lucide-react';
import NewProduct from './NewProduct';
import Link from 'next/link';
import Header from '@components/ui/Header';
import { db } from '@lib/prisma';
import { Item, Location, Product } from '@prisma/client';
import { Tag } from '@lib/enum';
import { isExpiring } from '@lib/date';
import EditLocation from './EditLocation';
import { Suspense } from 'react';
import TableLoading from './TableLoading';
import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/auth';
import SignIn from '@components/SignIn';
import { notFound } from 'next/navigation';

export async function generateMetadata({
	params,
}: {
	params: { location: string };
}) {
	const { name, userId } = await getLocationInfo(params.location);
	return {
		title: `${name} | LFHRS Inventory`,
		description: `Manage medical supply inventory for ${name}.`,
	};
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
		<>
			<div className='container py-8 flex flex-col gap-4'>
				<Link href='/inventory' className='w-fit mb-4'>
					<Button
						variant='ghost'
						className='p-0 hover:bg-background hover:text-muted-foreground'
					>
						<ChevronLeft className='w-4 h-4 mr-2' />
						Locations
					</Button>
				</Link>
				<div className='flex justify-between items-center flex-wrap'>
					<div className='flex gap-2'>
						<Header className='mb-4'>{name}</Header>
						<EditLocation name={name!} id={params.location} />
					</div>
					<NewProduct location={params.location} />
				</div>
				<Suspense fallback={<TableLoading />}>
					{/* @ts-ignore */}
					<InventoryTable id={params.location} />
				</Suspense>
			</div>
		</>
	);
}
