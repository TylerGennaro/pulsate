'use client';

import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { formatUTCDate } from '@lib/date';
import { PackageType } from '@lib/enum';
import { packageTypes } from '@lib/relations';
import { Item } from '@prisma/client';
import { CalendarClock, Minus, Plus, ShelvingUnit } from 'lucide-react';
import { Dispatch, SetStateAction, useMemo } from 'react';

export default function ItemCard({
	item,
	packageType,
	cart,
	setCart,
}: {
	item: Item;
	packageType: PackageType;
	cart: Map<number, number>;
	setCart: Dispatch<SetStateAction<Map<number, number>>>;
}) {
	const quantity = useMemo(() => cart.get(item.id) ?? 0, [cart, item.id]);
	return (
		<div className='flex flex-col items-end gap-2 px-2 py-6 xs:justify-between sm:grid sm:grid-cols-3 sm:items-center'>
			<div className='flex items-center gap-2'>
				<CalendarClock className='w-4 h-4 text-muted-foreground' />
				<span>{formatUTCDate(item.expires) ?? 'Never'}</span>
			</div>
			<div className='flex items-center gap-2'>
				<ShelvingUnit className='w-4 h-4 text-muted-foreground' />
				<span>{`${item.quantity} ${packageTypes[packageType]}`}</span>
			</div>

			<div className='flex shrink-0 place-content-end'>
				<Button
					className='h-10 rounded-none rounded-l-full'
					onClick={() => {
						const newCart = new Map(cart);
						newCart.set(item.id, Math.max(quantity - 1, 0));
						setCart(newCart);
					}}
				>
					<Minus size={16} />
				</Button>
				<Input
					inputClass='rounded-none text-center w-20 border-x-0 no-arrows h-10'
					className='w-20'
					placeholder='Quantity'
					value={quantity.toString()}
					onChange={e => {
						const newCart = new Map(cart);
						newCart.set(
							item.id,
							Math.min(Math.abs(Number(e.target.value) || 0), item.quantity),
						);
						setCart(newCart);
					}}
					name={`quantity-${item.id}`}
					type='number'
				/>
				<Button
					className='h-10 rounded-none rounded-r-full'
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
