'use client';

import { Item } from '@prisma/client';
import ItemCard from './ItemCard';
import { FormEvent, useState } from 'react';
import CartItem from './CartItem';
import { Button } from '@components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { crud } from '@lib/utils';
import { useRouter } from 'next/navigation';
import Heading from '@components/ui/heading';

export default function Checkout({
	items,
	productId,
}: {
	items: Item[];
	productId: string;
}) {
	const [selectedItems, setSelectedItems] = useState<Item[]>([]);
	const [loading, setLoading] = useState(false);
	const [recorded, setRecorded] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();

	async function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		const formData = new FormData(e.target as HTMLFormElement);
		const data = selectedItems.map((item) => ({
			id: item.id,
			quantity: parseInt(formData.get(`quantity-${item.id}`)?.toString() || ''),
		}));
		const result = await crud({
			method: 'POST',
			url: '/checkout',
			data: {
				productId,
				items: data,
			},
			notify: false,
		});
		if (result.status === 500) {
			setError(result.message);
			setSelectedItems(selectedItems);
		} else {
			setSelectedItems([]);
			setRecorded(true);
		}
		setLoading(false);
	}

	if (recorded)
		return (
			<div className='flex flex-wrap items-center justify-between gap-4 mt-8'>
				<div className='flex flex-col'>
					<span className='text-lg'>Checked out</span>
					<span className='text-muted-foreground'>
						Your response has been recorded.
					</span>
				</div>
				<Button
					onClick={() => {
						setRecorded(false);
						router.refresh();
					}}
					className='w-max'
				>
					Checkout more
				</Button>
			</div>
		);

	return (
		<div>
			{!items.length ? (
				<div className='flex flex-col items-center gap-2 mt-8'>
					<span className='text-lg'>Out of stock</span>
					<span className='text-muted-foreground'>Contact your manager</span>
				</div>
			) : (
				<>
					{items.map((item, index) => (
						<div key={index}>
							<ItemCard
								item={item}
								canAdd={!selectedItems.includes(item)}
								setSelected={setSelectedItems}
							/>
							<hr />
						</div>
					))}
					<Heading
						header='Cart'
						description='Review and checkout'
						className='mt-8 mb-4'
					/>
					<form onSubmit={submit}>
						<div className='flex justify-end'>
							<div className='flex flex-col gap-4'>
								{selectedItems.map((item) => (
									<CartItem
										item={item}
										setSelected={setSelectedItems}
										key={item.id}
									/>
								))}
							</div>
						</div>
						<div className='flex justify-end'>
							<div className='flex flex-col items-end gap-2 text-right'>
								<Button
									icon={ShoppingCart}
									className='mt-4 w-fit'
									disabled={!selectedItems.length}
									isLoading={loading}
								>
									Checkout
								</Button>
								{error && <span className='text-red-500'>{error}</span>}
							</div>
						</div>
					</form>
				</>
			)}
		</div>
	);
}
