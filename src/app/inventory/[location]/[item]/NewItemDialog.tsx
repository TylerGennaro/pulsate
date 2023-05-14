'use client';

import InputGroup from '@components/InputGroup';
import { Button } from '@components/ui/button';
import { DatePicker } from '@components/ui/date-picker';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';
import { Input } from '@components/ui/input';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function NewItemDialog() {
	const [date, setDate] = useState<Date>(new Date());
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>
					<Plus className='w-4 h-4 mr-2' />
					Add Item
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Item</DialogTitle>
					<DialogDescription>
						Add a new item to the stock with a unique expiration date.
					</DialogDescription>
				</DialogHeader>
				<div className='grid grid-cols-[min-content_repeat(3,_minmax(0,_1fr))] gap-2 items-center'>
					<label className='col-span-1 text-right'>
						Expiration
						<span className='text-red-500 ml-1'>*</span>
					</label>
					<DatePicker
						date={date}
						setDate={setDate}
						className='col-span-3 w-full'
					/>
					<label className='col-span-1 text-right'>
						Quantity
						<span className='text-red-500 ml-1'>*</span>
					</label>
					<Input className='col-span-3' type='number' />
					{/* <InputGroup label='Quantity' type='number' /> */}
				</div>
				<DialogFooter>
					<Button>
						<Plus className='w-4 h-4 mr-2' />
						Add
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
