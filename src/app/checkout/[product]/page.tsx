import { db } from '@lib/prisma';
import Checkout from './Checkout';
import { notFound } from 'next/navigation';
import Heading from '@components/ui/heading';
import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/auth';
import { Button } from '@components/ui/button';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { populateMetadata } from '@lib/utils';

export async function generateMetadata({
	params,
}: {
	params: { product: string };
}) {
	const product = await db.product.findFirst({
		select: {
			name: true,
		},
		where: {
			id: params.product,
		},
	});
	return populateMetadata(`${product?.name!} Checkout`);
}

async function getData(productId: string) {
	const product = await db.product.findFirst({
		select: {
			id: true,
			locationId: true,
			name: true,
			items: {
				select: {
					id: true,
					productId: true,
					quantity: true,
					expires: true,
					onOrder: true,
				},
				where: {
					onOrder: false,
				},
			},
		},
		where: {
			id: productId,
		},
	});
	const location = await db.location.findFirst({
		select: {
			id: true,
			name: true,
			userId: true,
		},
		where: {
			id: product?.locationId,
		},
	});
	return {
		location,
		product,
	};
}

export default async function Page({
	params,
}: {
	params: { product: string };
}) {
	const { location, product } = await getData(params.product);
	if (!product || !location) return notFound();
	const session = await getServerSession(authOptions);
	return (
		<div className='w-full max-w-screen-md px-2 py-4 border h-fit bg-zinc-50 dark:bg-zinc-900 md:my-4 md:rounded-md md:shadow-md md:p-4'>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<Heading
					header={product?.name}
					description={`Checkout ${product?.name} from ${location?.name}`}
				/>
				{session?.user?.id === location.userId && (
					<Link href={`/app/${location.id}/${product.id}`}>
						<Button variant='outline'>
							View Page
							<ExternalLink className='w-4 h-4 ml-2' />
						</Button>
					</Link>
				)}
			</div>
			<hr className='mt-6' />
			<Checkout items={product!.items} productId={params.product} />
		</div>
	);
}
