'use client';

import Form from '@components/Form';
import FormGroup from '@components/FormGroup';
import { Button } from '@components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';
import { crud } from '@lib/utils';
import { Product } from '@prisma/client';
import { CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OrderItem({ product }: { product: Product }) {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const router = useRouter();

	async function submit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		const data = new FormData(e.currentTarget);
		const result = await crud({
			url: `/items`,
			method: 'POST',
			data: {
				productId: product.id,
				date: null,
				quantity: data.get('quantity'),
				onOrder: true,
			},
		});
		if (result.status === 200) {
			setOpen(false);
			router.refresh();
		}
		setLoading(false);
	}
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button icon={CreditCard} variant='outline'>
					Order
				</Button>
			</DialogTrigger>
			<DialogContent>
				<Form onSubmit={submit}>
					<DialogHeader>
						<DialogTitle>Order {product.name}</DialogTitle>
						<DialogDescription>
							Tell the system that you placed an order for {product.name}.
						</DialogDescription>
					</DialogHeader>
					<FormGroup
						name='quantity'
						label='Quantity'
						placeholder='Quantity'
						type='number'
					/>
					<DialogFooter>
						<Button icon={CreditCard} isLoading={loading}>
							Place Order
						</Button>
					</DialogFooter>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
