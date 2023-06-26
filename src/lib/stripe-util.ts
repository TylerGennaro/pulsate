import { Tier } from '@prisma/client';
import { db } from './prisma';
import { stripe } from './stripe';

export async function getCustomer(userId: string) {
	const user = await db.user.findFirst({
		select: {
			stripe_customer_id: true,
		},
		where: {
			id: userId,
		},
	});
	if (!user) {
		throw new Error('User not found.');
	}
	if (!user?.stripe_customer_id) {
		const customerData = {
			metadata: {
				userId: userId,
			},
		};
		const customer = await stripe.customers.create(customerData);
		const { stripe_customer_id: customerId } = await db.user.update({
			where: {
				id: userId,
			},
			data: {
				stripe_customer_id: customer.id,
			},
		});
		return customerId!;
	}
	return user.stripe_customer_id;
}

export async function getUserFromCustomer(customerId: string) {
	const user = await db.user.findFirst({
		where: {
			stripe_customer_id: customerId,
		},
	});
	if (!user) {
		throw new Error('User not found.');
	}
	return user;
}

export async function getTier(userId: string) {
	const subscription = await db.subscription.findFirst({
		select: {
			tier: true,
		},
		where: {
			id: userId,
			status: 'active',
		},
	});
	if (!subscription) {
		return Tier.FREE;
	}
	return subscription.tier;
}
