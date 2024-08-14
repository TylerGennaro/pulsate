import { getProduct } from '@lib/data';
import { log } from '@lib/log';
import { sendCheckoutEmail } from '@lib/mail';
import { db } from '@lib/prisma';
import { catchError } from '@lib/utils';
import { notify } from '@lib/utils-server';
import { LogType } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.array(
	z.object({
		id: z.number().int().positive(),
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
	// Get request data
	const data = (await req.json()).filter(
		(item: { id: string; quantity: number }) => item.quantity > 0
	);
	const searchParams = new URL(req.url).searchParams;
	const productId = searchParams.get('productId');
	if (!productId) return new NextResponse('Bad request', { status: 400 });

	// Get product
	const product = await getProduct(productId, { items: true, location: true });
	if (!product)
		return NextResponse.json({ message: 'Product not found' }, { status: 404 });

	try {
		const items = schema.parse(data);
		const itemsWithExpiration = await Promise.all([
			...items.map(async (item) => {
				// Decrement quantity for all items
				const result = await db.item.update({
					where: { id: item.id },
					data: {
						quantity: {
							decrement: item.quantity,
						},
					},
				});
				if (!result) throw new Error('Item not found');
				return { ...item, expiration: result.expires };
			}),
		]);
		// Delete items with quantity <= 0
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

		// Check if product is low on stock
		const total = await getProductQuantity(product.id);
		// If low, notify location owner
		if (total < product.min) {
			notify({
				userId: product.location.userId,
				message: `${product.name} is low on stock.`,
				redirect: `/app/${product.location.id}/${product.id}`,
			});
		}

		// Log the checkout
		log(LogType.ITEM_CHECKOUT, {
			product: product.id,
			quantity: items.reduce((acc, item) => acc + item.quantity, 0),
		});

		// Send email to location owner
		const owner = await db.user.findFirst({
			where: { id: product.location.userId },
		});
		if (owner && owner.email)
			await sendCheckoutEmail(owner.email, product, itemsWithExpiration);

		return NextResponse.json({ message: 'Checkout recorded' }, { status: 200 });
	} catch (e) {
		console.log(e);
		return catchError(e);
	}
}

async function getProductQuantity(id: string) {
	const total = await db.item.aggregate({
		where: { productId: id },
		_sum: { quantity: true },
	});
	if (!total?._sum?.quantity) throw new Error('Could not aggregate quantity');
	return total._sum.quantity;
}
