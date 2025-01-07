'use client';

import ArrowButton from '@components/ArrowButton';
import { Button } from '@components/ui/button';
import { Checkbox } from '@components/ui/checkbox';
import { DatePicker } from '@components/ui/date-picker';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';
import { dateToUTC } from '@lib/date';
import { crud } from '@lib/utils';
import { Item } from '@prisma/client';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Check, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function ItemArrived({ item }: { item: Item }) {
	const [loading, setLoading] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [date, setDate] = useState<Date>(new Date());
	const [hasExpiration, setHasExpiration] = useState(true);

	const router = useRouter();
	async function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		const data = new FormData(e.currentTarget);
		const result = await crud({
			url: `/items`,
			method: 'PUT',
			data: {
				date: data.get('no-expire') !== 'on' ? data.get('date') : null,
				quantity: item.quantity,
				onOrder: false,
			},
			params: { id: String(item.id) },
		});
		if (result.status === 200) {
			setModalOpen(false);
			router.refresh();
		}
		setLoading(false);
	}
	return (
		<Dialog open={modalOpen} onOpenChange={setModalOpen}>
			<DialogTrigger asChild>
				<Button size='sm' icon={Check} isLoading={loading}>
					Arrived
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Set Expiration Date</DialogTitle>
					<DialogDescription>
						Set an expiration date for the arrived items.
					</DialogDescription>
				</DialogHeader>
				<form className='flex flex-col gap-4' onSubmit={submit}>
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
						<input
							value={date.toISOString()}
							name='date'
							hidden
							aria-hidden
							readOnly
						/>
					</div>
					<DialogFooter>
						<Button onClick={() => setModalOpen(false)}>Cancel</Button>
						<ArrowButton
							Icon={Save}
							disabled={loading}
							variant='primary'
							type='submit'
						>
							Save
						</ArrowButton>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
