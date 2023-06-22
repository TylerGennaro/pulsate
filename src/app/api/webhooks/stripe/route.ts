import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2022-11-15',
});

export async function POST(req: Request) {
	const body = await req.text();
	const signature = req.headers.get('stripe-signature');
	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature!,
			process.env.STRIPE_WEBHOOK_SECRET!
		);
	} catch (err) {
		console.log('Invalid signature', err);
		return new NextResponse('Invalid signature', { status: 400 });
	}

	// Handle the event
	switch (event.type) {
		case 'checkout.session.completed':
			const checkoutSessionCompleted = event.data.object;
			// Then define and call a function to handle the event checkout.session.completed
			console.log('✅ Success checkout', checkoutSessionCompleted);
			break;
		case 'customer.subscription.created':
			const customerSubscriptionCreated = event.data.object;
			// Then define and call a function to handle the event customer.subscription.created
			console.log('✅ Success subscription', customerSubscriptionCreated);
			break;
		case 'customer.subscription.deleted':
			const customerSubscriptionDeleted = event.data.object;
			// Then define and call a function to handle the event customer.subscription.deleted
			console.log('❌ Deleted subscription');
			break;
	}

	return new NextResponse('Success', { status: 200 });
}
