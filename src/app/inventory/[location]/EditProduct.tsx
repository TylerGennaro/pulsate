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
import { handleResponse } from '@lib/actionResponse';
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
import InputGroup from '@components/InputGroup';
import { useState } from 'react';
import { deleteProduct, editProduct } from '@actions/products';

export default function EditProduct({
	name,
	id,
}: {
	name: string;
	id: string;
}) {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const session = useSession();
	if (!session) return null;

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
					<form
						action={() => {
							deleteProduct(id, session.data?.user.id).then(handleResponse);
						}}
					>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This product and all its data will
								be removed from the system.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<Button type='submit' variant='destructive'>
								Delete
							</Button>
						</AlertDialogFooter>
					</form>
				</AlertDialogContent>
			</AlertDialog>
			<DialogContent>
				<form
					className='flex flex-col gap-4'
					action={(data) => {
						data.append('product-id', id);
						editProduct(data, session.data?.user.id).then(handleResponse);
						setOpen(false);
					}}
				>
					<DialogHeader>
						<DialogTitle>Edit product</DialogTitle>
						<DialogDescription>
							Change the name of this product.
						</DialogDescription>
					</DialogHeader>
					<InputGroup
						label='Name'
						placeholder='Product name'
						name='product-name'
						defaultValue={name}
					/>
					<DialogFooter>
						<Button icon={Save} type='submit'>
							Save
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
