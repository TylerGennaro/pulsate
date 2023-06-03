'use client';

import { useState } from 'react';
import { DatePicker } from '@components/ui/date-picker';
import { Checkbox } from '@components/ui/checkbox';
import { Input } from '@components/ui/input';
import { Item } from '@prisma/client';

export default function ItemForm({ item }: { item?: Item }) {
	const [date, setDate] = useState<Date>(item?.expires || new Date());
	const [hasExpiration, setHasExpiration] = useState(item?.expires !== null);
	return (
		<div className='grid grid-cols-[min-content_repeat(3,_minmax(0,_1fr))] gap-2 items-center'>
			<label className='col-span-1 text-right'>
				Expiration
				<span className='text-red-500 ml-1'>*</span>
			</label>
			<DatePicker
				date={date}
				setDate={setDate}
				className='col-span-3 w-full'
				disabled={!hasExpiration}
			/>
			<label className='col-span-1 text-right'>
				Quantity
				<span className='text-red-500 ml-1'>*</span>
			</label>
			<Input
				className='col-span-3'
				type='number'
				placeholder='Enter initial quantity'
				defaultValue={item?.quantity || 1}
				name='quantity'
			/>
			<Checkbox
				className='ml-auto'
				id='no-expire'
				name='no-expire'
				onCheckedChange={(checked) => setHasExpiration(!checked)}
				defaultChecked={!hasExpiration}
			/>
			<label className='col-span-3' htmlFor='no-expire'>
				Item does not expire
			</label>
			<Checkbox
				className='ml-auto'
				id='on-order'
				name='on-order'
				defaultChecked={item?.onOrder || false}
			/>
			<label className='col-span-3' htmlFor='on-order'>
				Item is on order
			</label>
			<input value={date.toISOString()} name='expires' hidden aria-hidden />
		</div>
	);
}
