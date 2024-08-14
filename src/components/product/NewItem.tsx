'use client';

import { Button } from '@components/ui/button';
import { Checkbox } from '@components/ui/checkbox';
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
import { crud } from '@lib/utils';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useRef, useState } from 'react';
import ItemForm from './ItemForm';
import ArrowButton from '@components/ArrowButton';
import { useQueryClient } from '@tanstack/react-query';

export default function NewItemDialog({ product }: { product: string }) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const queryClient = useQueryClient();
	const router = useRouter();

	const session = useSession();
	if (!session) return null;

	async function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		const data = new FormData(e.currentTarget);
		const result = await crud({
			url: `/items`,
			method: 'POST',
			data: {
				productId: product,
				date: data.get('no-expire') !== 'on' ? data.get('date') : null,
				quantity: data.get('quantity'),
				onOrder: data.get('on-order'),
			},
		});
		if (result.status === 200) {
			setOpen(false);
			router.refresh();
			queryClient.invalidateQueries({ queryKey: ['locations'] });
			queryClient.invalidateQueries({
				queryKey: ['activity', product],
			});
		}
		setLoading(false);
	}
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant='primary' icon={Plus}>
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
				<form className='flex flex-col gap-4' onSubmit={submit}>
					<ItemForm />
					<DialogFooter>
						<ArrowButton
							type='submit'
							onClick={() => setLoading(true)}
							isLoading={loading}
							Icon={Plus}
							variant='primary'
						>
							Add
						</ArrowButton>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
