'use client';

import { MoreVertical, Pencil, Save, Trash2 } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { Button } from '@components/ui/button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
	AlertDialog,
	AlertDialogAction,
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
import { FormEvent, useState } from 'react';
import { DatePicker } from '@components/ui/date-picker';
import { Checkbox } from '@components/ui/checkbox';
import { Item } from '@prisma/client';
import { crud, formDataToObject } from '@lib/utils';
import { Input } from '@components/ui/input';
import ItemForm from './ItemForm';

export default function EditProduct({ item }: { item: Item }) {
	const [open, setOpen] = useState(false);
	const [editLoading, setEditLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const router = useRouter();
	const session = useSession();
	if (!session) return null;

	async function update(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setEditLoading(true);
		const data = new FormData(e.currentTarget);
		const result = await crud({
			url: '/items',
			method: 'PUT',
			data: {
				date: data.get('no-expire') !== 'on' ? data.get('expires') : null,
				quantity: data.get('quantity'),
				onOrder: data.get('on-order'),
			},
			params: {
				id: item.id,
			},
		});
		if (result.status === 200) {
			setOpen(false);
			router.refresh();
		}
		setEditLoading(false);
	}

	async function remove(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setDeleteLoading(true);
		const result = await crud({
			url: '/items',
			method: 'DELETE',
			params: {
				id: item.id,
			},
		});
		if (result.status === 200) {
			setOpen(false);
			router.refresh();
		}
		setDeleteLoading(false);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<AlertDialog>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost'>
							<span className='sr-only'>Open menu</span>
							<MoreVertical size={20} />
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
								This action cannot be undone. This item and all its data will be
								removed from the system.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction asChild>
								<Button
									type='submit'
									variant='destructive'
									isLoading={deleteLoading}
								>
									Delete
								</Button>
							</AlertDialogAction>
						</AlertDialogFooter>
					</form>
				</AlertDialogContent>
			</AlertDialog>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit item</DialogTitle>
					<DialogDescription>
						Change the information of this item.
					</DialogDescription>
				</DialogHeader>
				<form className='flex flex-col gap-4' onSubmit={update}>
					<ItemForm item={item} />
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
