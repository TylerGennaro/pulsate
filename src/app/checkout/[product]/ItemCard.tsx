'use client';

import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { formatUTCDate } from '@lib/date';
import { PackageType } from '@lib/enum';
import { packageTypes } from '@lib/relations';
import { Item } from '@prisma/client';
import { Minus, Plus } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

export default function ItemCard({
	item,
	packageType,
	cart,
	setCart,
}: {
	item: Item;
	packageType: PackageType;
	cart: Map<string, number>;
	setCart: Dispatch<SetStateAction<Map<string, number>>>;
}) {
	const quantity = cart.get(item.id) ?? 0;
	// const [quantity, setQuantity] = useState(0);
	return (
		<div className='flex flex-col items-end gap-2 px-2 py-6'>
			<div className='flex items-center justify-between w-full'>
				<div className='flex flex-col'>
					<span className='text-lg'>Quantity</span>
					<span className='text-muted-foreground'>{`${item.quantity} ${packageTypes[packageType]}`}</span>
				</div>
				<div className='flex flex-col items-end'>
					<span className='text-lg'>Expires</span>
					<span className='text-muted-foreground'>
						{formatUTCDate(item.expires) ?? 'Never'}
					</span>
				</div>
			</div>

			<div className='flex justify-end'>
				<Button
					variant='outline'
					className='rounded-none rounded-l-full'
					onClick={() => {
						const newCart = new Map(cart);
						newCart.set(item.id, Math.max(quantity - 1, 0));
						setCart(newCart);
					}}
				>
					<Minus size={16} />
				</Button>
				<Input
					className='w-20 text-center rounded-none border-x-0 no-arrows'
					placeholder='Quantity'
					value={quantity}
					onChange={(e) => {
						const newCart = new Map(cart);
						newCart.set(
							item.id,
							Math.min(
								Math.max(parseInt(e.target.value) || 0, 0),
								item.quantity
							)
						);
					}}
					name={`quantity-${item.id}`}
					type='number'
				/>
				<Button
					variant='outline'
					className='rounded-none rounded-r-full'
					onClick={() => {
						const newCart = new Map(cart);
						newCart.set(item.id, Math.min(quantity + 1, item.quantity));
						setCart(newCart);
					}}
				>
					<Plus size={16} />
				</Button>
			</div>
		</div>
	);
}
