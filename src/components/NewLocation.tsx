'use client';

import { Button } from '@components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';
import { Plus } from 'lucide-react';
import InputGroup from '@components/FormGroup';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parseFormData } from '@lib/utils';
import ArrowButton from './ArrowButton';

export default function NewLocationDialog() {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		mutationFn: async (e: FormEvent<HTMLFormElement>) => {
			const data = parseFormData(e);
			return fetch('/api/locations', {
				method: 'POST',
				body: data,
			});
		},
		onSettled: async (res) => {
			const text = await res?.text();
			if (res?.ok) {
				queryClient.invalidateQueries({ queryKey: ['locations'] });
				setOpen(false);
				router.push('/app/' + text);
			} else toast.error('Failed to add location: ' + text);
		},
	});
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					icon={Plus}
					className='px-2 py-1 text-xs h-fit'
					variant='primary'
				>
					New Location
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={mutate}>
					<DialogHeader>
						<DialogTitle>Add New Location</DialogTitle>
						<DialogDescription>
							Add a new inventory location. This inventory will be separate from
							any other locations set up.
						</DialogDescription>
					</DialogHeader>

					<div className='grid gap-4 py-4 min-w-fit'>
						<InputGroup label='Name' name='name' required />
					</div>
					<DialogFooter>
						<ArrowButton
							className='ml-auto'
							Icon={Plus}
							isLoading={isPending}
							type='submit'
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
