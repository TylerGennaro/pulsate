'use client';

import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { deleteLocation, revalidateLocations } from '@actions/locations';
import { Button } from '@components/ui/button';
import { useSession } from 'next-auth/react';
import { useTransition } from 'react';
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
import { revalidatePath } from 'next/cache';

export default function EditLocation({ location }: { location: string }) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const session = useSession();
	if (!session) return null;

	return (
		<AlertDialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' className='h-8 w-8 p-0'>
						<span className='sr-only'>Open menu</span>
						<MoreVertical className='h-6 w-6' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem>
						<Pencil className='w-4 h-4 mr-2' />
						Edit
					</DropdownMenuItem>
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
						deleteLocation(location, session.data?.user.id).then(
							handleResponse
						);
						router.push('/inventory');
						setTimeout(() => {
							revalidateLocations();
						}, 500);
					}}
				>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This location and all its data will
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
	);
}
