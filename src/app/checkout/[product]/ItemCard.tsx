'use client';

import { Button } from '@components/ui/button';
import { formatExpirationDate } from '@lib/utils';
import { Item } from '@prisma/client';
import { format } from 'date-fns';
import { ShoppingCart, Trash2 } from 'lucide-react';

export default function ItemCard({
	item,
	canAdd,
	setSelected,
}: {
	item: Item;
	canAdd: boolean;
	setSelected: React.Dispatch<React.SetStateAction<Item[]>>;
}) {
	return (
		<div className='flex flex-col items-end gap-2 px-2 py-6'>
			<div className='flex items-center justify-between w-full'>
				<div className='flex flex-col'>
					<span className='text-lg'>Quantity</span>
					<span className='text-muted-foreground'>{item.quantity}</span>
				</div>
				<div className='flex flex-col'>
					<span className='text-lg'>Expires</span>
					<span className='text-muted-foreground'>
						{formatExpirationDate(item.expires)}
					</span>
				</div>
			</div>

			<div className='flex justify-end gap-2'>
				<Button
					icon={Trash2}
					variant='outline'
					disabled={canAdd}
					onClick={() => setSelected((arr) => arr.filter((i) => i !== item))}
				>
					Remove from cart
				</Button>
				<Button
					icon={ShoppingCart}
					disabled={!canAdd}
					onClick={() => setSelected((arr) => [...arr, item])}
				>
					Add to cart
				</Button>
			</div>
		</div>
	);
}
