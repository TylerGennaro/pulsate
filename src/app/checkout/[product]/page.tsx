import Container from '@components/Container';
import { db } from '@lib/prisma';
import { populateMetadata } from '@lib/utils';
import Checkout from './Checkout';

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

// async function getData(productId: string) {
// 	const product = await db.product.findFirst({
// 		select: {
// 			id: true,
// 			locationId: true,
// 			name: true,
// 			items: {
// 				select: {
// 					id: true,
// 					productId: true,
// 					product: {
// 						select: {
// 							id: true,
// 							package: true,
// 						},
// 					},
// 					quantity: true,
// 					expires: true,
// 					onOrder: true,
// 				},
// 				where: {
// 					onOrder: false,
// 				},
// 			},
// 		},
// 		where: {
// 			id: productId,
// 		},
// 	});
// 	const location = await db.location.findFirst({
// 		select: {
// 			id: true,
// 			name: true,
// 			userId: true,
// 		},
// 		where: {
// 			id: product?.locationId,
// 		},
// 	});
// 	return {
// 		location,
// 		product,
// 	};
// }

export default async function Page({
	params,
}: {
	params: { product: string };
}) {
	return (
		<Container className='w-full max-w-screen-lg m-2 lg:m-8 h-max'>
			<Checkout productId={params.product} />
		</Container>
	);
}
