import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { formatExpirationDate } from '@lib/utils';
import { Item } from '@prisma/client';
import { X } from 'lucide-react';

export default function CartItem({
	item,
	setSelected,
}: {
	item: Item;
	setSelected: React.Dispatch<React.SetStateAction<Item[]>>;
}) {
	return (
		<div className='grid grid-cols-[1fr_1fr_min-content] items-center'>
			<div className='flex flex-wrap gap-2'>
				<span className='font-semibold'>Expires</span>
				<span className='text-muted-foreground'>
					{formatExpirationDate(item.expires)}
				</span>
			</div>
			<div className='flex items-center gap-1'>
				<Input
					type='number'
					max={item.quantity}
					placeholder='Quantity'
					defaultValue={1}
					name={`quantity-${item.id}`}
					className='w-32 ml-4'
				/>
				<span className='text-muted-foreground w-max'>/ {item.quantity}</span>
			</div>
			<Button
				variant='ghost'
				className='p-2 ml-1 w-fit h-fit text-muted-foreground'
				onClick={() => setSelected((arr) => arr.filter((i) => i !== item))}
			>
				<X size={16} />
			</Button>
		</div>
	);
}
