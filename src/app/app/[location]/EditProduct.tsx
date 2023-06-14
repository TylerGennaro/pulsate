'use client';

import { Pencil, Save, Trash2 } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { Button } from '@components/ui/button';
import { useRouter } from 'next/navigation';
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
import { FormEvent, useState } from 'react';
import { crud, formDataToObject } from '@lib/utils';
import ProductForm from './ProductForm';
import { PackageType } from '@lib/enum';

export default function EditProduct({
	defaultValues,
	id,
	children,
}: {
	defaultValues?: {
		name?: string;
		min?: number;
		max?: number;
		packageType?: PackageType;
	};
	id: string;
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState(false);
	const [editLoading, setEditLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const router = useRouter();

	async function update(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setEditLoading(true);
		const data = new FormData(e.currentTarget);
		const result = await crud({
			url: '/products',
			method: 'PUT',
			data: formDataToObject(data),
			params: { id },
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
			url: '/products',
			method: 'DELETE',
			params: { id },
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
					<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
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
								This action cannot be undone. This product and all its data will
								be removed from the system.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<Button
								type='submit'
								variant='destructive'
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
						<DialogTitle>Edit product</DialogTitle>
						<DialogDescription>
							Change the product&apos;s information.
						</DialogDescription>
					</DialogHeader>
					<ProductForm defaultValues={defaultValues} />
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
