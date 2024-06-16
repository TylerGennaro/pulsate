'use client';

import ArrowButton from '@components/ArrowButton';
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
import { Input } from '@components/ui/input';
import { Mail } from 'lucide-react';
import { ChangeEvent, ReactNode, useEffect, useState } from 'react';

const USERS = [
	{
		name: 'John Doe',
		email: 'johndoe@example.com',
		imageUrl: '/images/avatar.jpg',
	},
	{
		name: 'Jane Doe',
		email: 'janedoe@example.com',
		imageUrl: '/images/avatar.jpg',
	},
];

type AddUserPermissionDialogProps = {
	children: ReactNode;
};

export default function AddUserPermissionDialog({
	children,
}: AddUserPermissionDialogProps) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState('');
	const [searchValue, setSearchValue] = useState('');

	const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
		if (e.target.value !== '') {
			setIsDropdownOpen(true);
			setTimeout(() => e.target.focus(), 50);
		} else {
			setIsDropdownOpen(false);
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) setIsDropdownOpen(false);
	};

	useEffect(() => {
		if (selectedUser) {
			setIsDropdownOpen(false);
			setSearchValue(selectedUser);
		}
	}, [selectedUser]);

	return (
		<Dialog onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add User to Location</DialogTitle>
					<DialogDescription className='block'>
						Enter the user's email to send an invitation to share. Once the user
						accepts the invitation, you can manage their permissions.
					</DialogDescription>
				</DialogHeader>
				<hr className='mt-1' />
				<div className='py-4'>
					<label className='block mb-2'>Email</label>
					<Input />
				</div>
				<DialogFooter>
					<Button>Cancel</Button>
					<ArrowButton Icon={Mail} variant='primary'>
						Send Invitation
					</ArrowButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
