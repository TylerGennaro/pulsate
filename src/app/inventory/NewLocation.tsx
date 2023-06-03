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
import InputGroup from '@components/InputGroup';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function NewLocationDialog() {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	async function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		const data = {
			name: e.currentTarget['location-name'].value,
		};
		const result = await fetch('/api/locations', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
		}).then(async (res) => {
			return { message: await res.text(), status: res.status };
		});

		if (result.status === 200) {
			toast.success(result.message);
			setOpen(false);
			router.refresh();
		} else {
			toast.error(result.message);
		}
		setLoading(false);
	}
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className='mb-4'>
					<Plus className='w-4 h-4 mr-2' />
					New Location
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={submit}>
					<DialogHeader>
						<DialogTitle>Add New Location</DialogTitle>
						<DialogDescription>
							Add a new inventory location. This inventory will be separate from
							any other locations set up.
						</DialogDescription>
					</DialogHeader>

					<div className='grid gap-4 py-4 min-w-fit'>
						<InputGroup
							label='Name'
							name='location-name'
							placeholder='Enter location name'
							required
						/>
					</div>
					<DialogFooter>
						<Button className='ml-auto' icon={Plus} isLoading={loading}>
							Add
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
