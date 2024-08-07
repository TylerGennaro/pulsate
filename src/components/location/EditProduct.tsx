'use client';

import { Pencil, Save, Trash2 } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
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
import { FormEvent, FormEventHandler, useState } from 'react';
import { crud, formDataToObject, parseFormData } from '@lib/utils';
import ProductForm from './ProductForm';
import { PackageType } from '@lib/enum';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ArrowButton from '@components/ArrowButton';
import { toast } from '@components/ui/use-toast';

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
		position?: string;
		url?: string;
	};
	id: string;
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState(false);
	const [alertOpen, setAlertOpen] = useState(false);
	const queryClient = useQueryClient();

	const updateMutation = useMutation({
		mutationFn: (e: FormEvent<HTMLFormElement>) => {
			const data = parseFormData(e);
			return fetch(`/api/products?id=${id}`, {
				method: 'PUT',
				body: data,
			});
		},
		onSettled: async (res) => {
			if (res?.ok) {
				queryClient.invalidateQueries({ queryKey: ['products'] });
				setOpen(false);
			} else toast.error('Failed to update product', await res?.text());
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			return fetch(`/api/products?id=${id}`, {
				method: 'DELETE',
			});
		},
		onSettled: async (res) => {
			if (res?.ok) {
				queryClient.invalidateQueries({ queryKey: ['products'] });
				setAlertOpen(false);
				toast.success('Product deleted.');
			} else toast.error('Failed to update product', await res?.text());
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DialogTrigger asChild>
							<DropdownMenuItem>
								<Pencil className='w-4 h-4 mr-2' />
								Edit
							</DropdownMenuItem>
						</DialogTrigger>
						<AlertDialogTrigger asChild>
							<DropdownMenuItem className='text-red-500 focus:text-red-500 dark:focus:text-red-500'>
								<Trash2 className='w-4 h-4 mr-2' /> Delete
							</DropdownMenuItem>
						</AlertDialogTrigger>
					</DropdownMenuContent>
				</DropdownMenu>
				<AlertDialogContent>
					<form onSubmit={deleteMutation.mutate}>
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
								isLoading={deleteMutation.isPending}
							>
								Delete
							</Button>
						</AlertDialogFooter>
					</form>
				</AlertDialogContent>
			</AlertDialog>
			<DialogContent>
				<form className='flex flex-col gap-4' onSubmit={updateMutation.mutate}>
					<DialogHeader>
						<DialogTitle>Edit product</DialogTitle>
						<DialogDescription>
							Change the product&apos;s information.
						</DialogDescription>
					</DialogHeader>
					<ProductForm defaultValues={defaultValues} />
					<DialogFooter>
						<ArrowButton
							Icon={Save}
							type='submit'
							isLoading={updateMutation.isPending}
							variant='primary'
						>
							Save
						</ArrowButton>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
