'use client';

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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { crud, formDataToObject } from '@lib/utils';
import { Item } from '@prisma/client';
import { MoreVertical, Pencil, Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, startTransition, useState, useTransition } from 'react';
import ItemForm from './ItemForm';
import { useQueryClient } from '@tanstack/react-query';
import ArrowButton from '@components/ArrowButton';
import { updateItem } from '@actions/item';
import { toast } from '@components/ui/use-toast';

export default function EditItem({ item }: { item: Item }) {
	const [open, setOpen] = useState(false);
	const [editLoading, setEditLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [isEditPending, startEditTransition] = useTransition();
	const queryClient = useQueryClient();
	const router = useRouter();

	async function update(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		startEditTransition(async () => {
			const formData = new FormData(e.currentTarget);
			const data = formDataToObject(formData);
			const response = await updateItem(item.id, item.productId, {
				expires: data['no-expire'] === 'on' ? null : data['date'],
				quantity: parseInt(data['quantity']),
				onOrder: data['on-order'] === 'on',
			});
			if (!response.ok) {
				toast.error('Failed to update item', response.message);
				return;
			}
			toast.success('Item updated.');
			setOpen(false);
		});
		// const result = await crud({
		// 	url: '/items',
		// 	method: 'PUT',
		// 	data: {
		// 		productId: item.productId,
		// 		date: data.get('no-expire') !== 'on' ? data.get('date') : null,
		// 		quantity: data.get('quantity'),
		// 		onOrder: data.get('on-order'),
		// 	},
		// 	params: { id: String(item.id) },
		// });
		// if (result.status === 200) {
		// 	setOpen(false);
		// 	router.refresh();
		// 	queryClient.invalidateQueries({ queryKey: ['locations'] });
		// 	queryClient.invalidateQueries({
		// 		queryKey: ['activity', item.productId],
		// 	});
		// }
	}

	async function remove(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setDeleteLoading(true);
		const result = await crud({
			url: '/items',
			method: 'DELETE',
			params: { id: String(item.id) },
		});
		if (result.status === 200) {
			router.refresh();
			queryClient.invalidateQueries({ queryKey: ['locations'] });
			queryClient.invalidateQueries({
				queryKey: ['activity', item.productId],
			});
			setOpen(false);
		}
		setDeleteLoading(false);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<AlertDialog>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button size='icon'>
							<span className='sr-only'>Open menu</span>
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
								This action cannot be undone. This item and all its data will be
								removed from the system.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<ArrowButton
								type='submit'
								Icon={Trash2}
								variant='destructive'
								isLoading={deleteLoading}
							>
								Delete
							</ArrowButton>
						</AlertDialogFooter>
					</form>
				</AlertDialogContent>
			</AlertDialog>
			<DialogContent>
				<form className='flex flex-col gap-4' onSubmit={update}>
					<DialogHeader>
						<DialogTitle>Edit item</DialogTitle>
						<DialogDescription>
							Change the items&apos;s information.
						</DialogDescription>
					</DialogHeader>
					<ItemForm item={item} />
					<DialogFooter>
						<ArrowButton
							variant='primary'
							Icon={Save}
							type='submit'
							isLoading={editLoading || isEditPending}
						>
							Save
						</ArrowButton>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
