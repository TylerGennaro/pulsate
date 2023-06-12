import { db } from '@lib/prisma';
import Checkout from './Checkout';
import { notFound } from 'next/navigation';
import Heading from '@components/ui/heading';

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
	return {
		title: `Checkout ${product?.name} | Pulsate`,
		description: `Checkout ${product?.name} from the medical supplies inventory.`,
	};
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
			name: true,
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
	return (
		<div className='max-w-screen-md w-full h-fit bg-foreground py-4 px-2 md:my-4 md:rounded-md md:shadow-md md:p-4'>
			<div className='flex flex-col gap-2'>
				<Heading
					header={product?.name}
					description={`Checkout ${product?.name} from ${location?.name}`}
				/>
			</div>
			<hr className='mt-6' />
			<Checkout items={product!.items} productId={params.product} />
		</div>
	);
}
