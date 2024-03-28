'use client';

import { MoreVertical, Pencil, Save, Settings, Trash2 } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { Button } from '@components/ui/button';
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@components/ui/alert-dialog';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';
import InputGroup from '@components/FormGroup';
import { FormEvent, useState } from 'react';
import { crud } from '@lib/utils';

export default function EditLocation({
	name,
	id,
}: {
	name: string;
	id: string;
}) {
	const [open, setOpen] = useState(false);
	const [editLoading, setEditLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);

	async function update(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setEditLoading(true);
		const data = {
			name: e.currentTarget['location-name'].value as string,
		};
		const result = await crud({
			url: `/locations`,
			method: 'PUT',
			data,
			params: { id },
		});
		setEditLoading(false);
		if (result?.status === 200) setOpen(false);
	}

	async function remove(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setDeleteLoading(true);
		const result = await crud({
			url: `/locations`,
			method: 'DELETE',
			params: { id },
		});
		setDeleteLoading(false);
		if (result?.status === 200) setOpen(false);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<AlertDialog>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='outline'>
							<MoreVertical size={16} />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DialogTrigger asChild>
							<DropdownMenuItem>
								<Pencil className='w-4 h-4 mr-2' />
								Edit
							</DropdownMenuItem>
						</DialogTrigger>
						<AlertDialogTrigger asChild>
							<DropdownMenuItem className='text-red-500'>
								<Trash2 className='w-4 h-4 mr-2' /> Delete
							</DropdownMenuItem>
						</AlertDialogTrigger>
					</DropdownMenuContent>
				</DropdownMenu>
				<AlertDialogContent>
					<form onSubmit={remove}>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This location and all its data
								will be removed from the system.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<Button
								type='submit'
								variant='destructive'
								icon={Trash2}
								isLoading={deleteLoading}
							>
								Delete
							</Button>
						</AlertDialogFooter>
					</form>
				</AlertDialogContent>
			</AlertDialog>
			<DialogContent>
				<form className='flex flex-col gap-4' onSubmit={update}>
					<DialogHeader>
						<DialogTitle>Edit location</DialogTitle>
						<DialogDescription>
							Change the name of this location.
						</DialogDescription>
					</DialogHeader>
					<InputGroup
						label='Name'
						placeholder='Location name'
						name='location-name'
						defaultValue={name}
					/>
					<DialogFooter>
						<Button icon={Save} type='submit' isLoading={editLoading}>
							Save
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
