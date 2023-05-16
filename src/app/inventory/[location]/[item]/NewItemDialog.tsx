'use client';

import { addItem } from '@actions/items';
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
import { handleResponse } from '@lib/actionResponse';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function NewItemDialog({
	location,
	product,
}: {
	location: string;
	product: string;
}) {
	const [date, setDate] = useState<Date>(new Date());
	const [open, setOpen] = useState(false);
	const session = useSession();
	if (!session) return null;
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className='w-4 h-4 mr-2' />
					Add Item
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form
					className='flex flex-col gap-4'
					action={(data) => {
						data.append('date', date.toISOString());
						data.append('location', location);
						data.append('product', product);
						addItem(data, session.data?.user?.id).then((res) => {
							handleResponse(res);
							setOpen(false);
						});
					}}
				>
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
						<Input
							className='col-span-3'
							type='number'
							placeholder='Enter initial quantity'
							defaultValue={1}
							name='quantity'
						/>
					</div>
					<DialogFooter>
						<Button type='submit'>
							<Plus className='w-4 h-4 mr-2' />
							Add
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
