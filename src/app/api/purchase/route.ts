import { plans } from '@config/plans';
import { authOptions } from '@lib/auth';
import { stripe } from '@lib/stripe';
import { getCustomer } from '@lib/stripe-util';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get('id');
	try {
		if (!id?.startsWith('cs_')) {
			throw new Error('Invalid session id');
		}
		const session = await stripe.checkout.sessions.retrieve(id);
		return NextResponse.json(session, { status: 200 });
	} catch (err) {
		const message =
			err instanceof Error ? err.message : 'Internal server error';
		return NextResponse.json({ message }, { status: 500 });
	}
}

export async function POST(req: Request, res: Response) {
	const body = await req.json();
	const plan = body.plan as string;
	const planData = plans[plan.toLowerCase()];
	const origin = req.headers.get('origin');
	const userSession = await getServerSession(authOptions);
	if (!userSession) {
		return NextResponse.redirect(
			`${origin}/signin?callbackUrl=${origin}/plans`
		);
	}
	try {
		const customerId = await getCustomer(userSession.user.id);
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			mode: 'subscription',
			customer: customerId,
			line_items: planData.map((price) => ({
				price,
				quantity: 1,
			})),
			success_url: `${req.headers.get(
				'origin'
			)}/purchase/{CHECKOUT_SESSION_ID}`,
			cancel_url: `${req.headers.get('origin')}/plans`,
			subscription_data: {
				metadata: {
					plan,
				},
			},
		});
		return NextResponse.json(session, { status: 200 });
	} catch (err) {
		const message =
			err instanceof Error ? err.message : 'Internal server error';
		return NextResponse.json({ message }, { status: 500 });
	}
}
