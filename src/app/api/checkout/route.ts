import { db } from '@lib/prisma';
import { catchError } from '@lib/utils';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.array(
	z.object({
		id: z.string().cuid(),
		quantity: z.number().int().positive(),
	})
);

export async function GET(req: Request) {
	const searchParams = new URL(req.url).searchParams;
	const productId = searchParams.get('productId');
	if (!productId) return new NextResponse('Bad request', { status: 400 });
	const product = await db.product.findMany({
		select: {
			id: true,
			location: {
				select: {
					name: true,
					userId: true,
					id: true,
				},
			},
			name: true,
			items: {
				where: {
					onOrder: false,
				},
			},
			package: true,
		},
		where: { id: productId },
	});
	if (!product || !product.length)
		return new NextResponse('Product not found', { status: 404 });
	return NextResponse.json(product[0], { status: 200 });
}

export async function POST(req: Request) {
	// const session = await getServerSession();
	// if (!session) return new NextResponse('Unauthorized', { status: 401 });
	const data = (await req.json()).filter(
		(item: { id: string; quantity: number }) => item.quantity > 0
	);
	try {
		const items = schema.parse(data);
		items.forEach(async (items) => {
			const result = await db.item.update({
				where: { id: items.id },
				data: {
					quantity: {
						decrement: items.quantity,
					},
				},
			});
			if (!result) throw new Error('Item not found');
		});
		await db.item.deleteMany({
			where: {
				quantity: {
					lte: 0,
				},
				id: {
					in: items.map((item) => item.id),
				},
			},
		});
		// 	const product = await db.product.findUnique({
		// 		where: { id: data.productId },
		// 		include: {
		// 			location: true,
		// 			items: true,
		// 		},
		// 	});
		// 	if (
		// 		product &&
		// 		product?.items.reduce((acc, item) => acc + item.quantity, 0) <
		// 			product?.min
		// 	) {
		// 		notify({
		// 			userId: product?.location.userId!,
		// 			message: `${product?.name} is low on stock.`,
		// 			redirect: `/app/${product?.location.id}/${product?.id}`,
		// 		});
		// 	}
		// 	log(LogType.ITEM_CHECKOUT, {
		// 		product: data.productId,
		// 		quantity: items.reduce((acc, item) => acc + item.quantity, 0),
		// 	});
		// 	// console.log(`
		// 	// Checkout recorded:
		// 	// User: ${session?.user?.name}
		// 	// Time: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}
		// 	// Product: ${product?.name}
		// 	// Quantity: ${items.reduce((acc, item) => acc + item.quantity, 0)}
		// 	// `);
		// 	const owner = await db.user.findFirst({
		// 		where: { id: product?.location.userId },
		// 	});
		// 	await sendMail(
		// 		owner?.email!,
		// 		`[${product?.location.name}] Checkout recorded`,
		// 		`
		// 		<html>
		// 		<body>
		// 			<h2>Checkout recorded</h2>
		// 			<p>
		// 				<strong>User:</strong> ${session?.user?.name ?? 'Guest'}<br>
		// 				<strong>Product:</strong> ${product?.name}<br>
		// 				<strong>Quantity:</strong> ${items.reduce(
		// 					(acc, item) => acc + item.quantity,
		// 					0
		// 				)}<br>
		// 				<strong>Time:</strong> ${new Date().toLocaleString('en-US', {
		// 					timeZone: 'America/New_York',
		// 				})}<br>
		// 			</p>
		// 		</body>
		// 	</html>
		// 	`
		// 	);
		return NextResponse.json('Checkout recorded.', { status: 200 });
	} catch (e) {
		console.log(e);
		return catchError(e);
	}
}
