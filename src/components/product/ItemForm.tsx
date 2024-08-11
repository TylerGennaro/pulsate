'use client';

import { Checkbox } from '@components/ui/checkbox';
import { DatePicker } from '@components/ui/date-picker';
import { Input } from '@components/ui/input';
import { dateToUTC } from '@lib/date';
import { Item } from '@prisma/client';
import { useState } from 'react';

export default function ItemForm({ item }: { item?: Item }) {
	const [date, setDate] = useState<Date>(
		dateToUTC(item?.expires) || new Date()
	);
	const [hasExpiration, setHasExpiration] = useState(item?.expires !== null);
	return (
		<div className='grid grid-cols-[min-content_repeat(3,_minmax(0,_1fr))] gap-2 items-center'>
			<label className='col-span-1 text-right'>
				Expiration
				<span className='ml-1 text-red-500'>*</span>
			</label>
			<DatePicker
				date={date}
				setDate={setDate}
				className='w-full col-span-3'
				disabled={!hasExpiration}
			/>
			<label className='col-span-1 text-right'>
				Quantity
				<span className='ml-1 text-red-500'>*</span>
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
				onCheckedChange={(checked) => setHasExpiration(!checked)}
				defaultChecked={item?.onOrder || false}
			/>
			<label className='col-span-3' htmlFor='on-order'>
				Item is on order
			</label>
			<input
				value={date.toISOString()}
				name='date'
				hidden
				aria-hidden
				readOnly
			/>
		</div>
	);
}
