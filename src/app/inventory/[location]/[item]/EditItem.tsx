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
import { deleteItem, editItem } from '@actions/items';
import { Input } from '@components/ui/input';
import { DatePicker } from '@components/ui/date-picker';
import { Checkbox } from '@components/ui/checkbox';
import { Item } from '@prisma/client';

export default function EditProduct({ item }: { item: Item }) {
	const [open, setOpen] = useState(false);
	const [date, setDate] = useState<Date>(item.expires || new Date());
	const [hasExpiration, setHasExpiration] = useState(item.expires !== null);
	const [loading, setLoading] = useState(false);
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
					// action={() => {
					// 	deleteItem(item.id, session.data?.user.id).then(handleResponse);
					// 	setLoading(false);
					// }}
					>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This item and all its data will be
								removed from the system.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<Button
								type='submit'
								variant='destructive'
								onClick={() => setLoading(true)}
								isLoading={loading}
							>
								Delete
							</Button>
						</AlertDialogFooter>
					</form>
				</AlertDialogContent>
			</AlertDialog>
			<DialogContent>
				<form
					className='flex flex-col gap-4'
					// action={(data) => {
					// 	data.append('item-id', item.id);
					// 	data.append('item-exp', date.toISOString());
					// 	editItem(data, session.data?.user.id).then(handleResponse);
					// 	setOpen(false);
					// 	setLoading(false);
					// }}
				>
					<DialogHeader>
						<DialogTitle>Edit item</DialogTitle>
						<DialogDescription>
							Change the information of this item.
						</DialogDescription>
					</DialogHeader>
					<div className='grid grid-cols-[min-content_repeat(3,_minmax(0,_1fr))] gap-2 items-center'>
						<label className='col-span-1 text-right'>
							Expiration
							<span className='text-red-500 ml-1'>*</span>
						</label>
						<DatePicker
							date={date}
							setDate={setDate}
							className='col-span-3 w-full'
							disabled={!hasExpiration}
						/>
						<Checkbox
							className='ml-auto'
							id='on-order'
							name='item-onOrder'
							defaultChecked={item.onOrder}
						/>
						<label className='col-span-3' htmlFor='on-order'>
							Item is on order
						</label>
						<Checkbox
							className='ml-auto'
							id='no-expire'
							name='no-expire'
							onCheckedChange={(checked) => setHasExpiration(!checked)}
							defaultChecked={!hasExpiration}
						/>
						<label className='col-span-3' htmlFor='no-expire'>
							Item does not expire
						</label>
					</div>
					<DialogFooter>
						<Button
							icon={Save}
							type='submit'
							onClick={() => setLoading(true)}
							isLoading={loading}
						>
							Save
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
