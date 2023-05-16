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
import { addLocation } from '@actions/locations';
import InputGroup from '@components/InputGroup';
import { useSession } from 'next-auth/react';
import { handleResponse } from '@lib/actionResponse';
import { useState } from 'react';

export default function NewLocationDialog() {
	const [open, setOpen] = useState(false);
	const session = useSession();
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className='mb-4'>
					<Plus className='w-4 h-4 mr-2' />
					New Location
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form
					action={(data: FormData) => {
						addLocation(data, session.data?.user.id).then(handleResponse);
						setOpen(false);
					}}
				>
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
						<Button className='ml-auto'>
							<Plus className='w-4 h-4 mr-2' />
							Add
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
