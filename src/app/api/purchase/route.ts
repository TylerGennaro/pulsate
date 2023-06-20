// import { Stripe } from "@stripe/stripe-js";

import { NextResponse } from 'next/server';

// const params: Stripe.Checkout.SessionCreateParams = {
// 	payment_method_types: ["card"],
// 	submit_type: "pay",
// 	line_items: [
// 		{
// 			name: "Manager Package",
// 			amount: formatAmountForStripe(399, CURRENCY),
// 		}
// 	]

export function GET() {
	return new NextResponse('Hello World');
}
