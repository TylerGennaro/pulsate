'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { fetchJSONPost } from '@lib/utils';
import getStripe from '@lib/stripe';
import React from 'react';

interface Props {
	plan: string;
	children?: React.ReactNode;
	disabled?: boolean;
}

export const PlanPurchaseButton = React.forwardRef<HTMLButtonElement, Props>(
	({ plan, children, ...props }, ref: any) => {
		const [loading, setLoading] = useState(false);
		async function handleClick() {
			setLoading(true);
			const response = await fetchJSONPost('/api/purchase', { plan });
			if (response.status === 500) {
				return console.error(response.data.message);
			}
			const stripe = await getStripe();
			const { error } = await stripe!.redirectToCheckout({
				sessionId: response.data.id,
			});
			console.warn(error.message);
			setLoading(false);
		}
		return (
			<Button onClick={handleClick} isLoading={loading} {...props} ref={ref}>
				{children}
			</Button>
		);
	}
);
