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

type AddUserPermissionDialogProps = {
	children: ReactNode;
};

export default function AddUserPermissionDialog({
	children,
}: AddUserPermissionDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add User to Location</DialogTitle>
					<DialogDescription className='block'>
						Enter the user&apos;s email to send an invitation to share. Once the
						user accepts the invitation, you can manage their permissions.
					</DialogDescription>
				</DialogHeader>
				<hr className='mt-1' />
				<div className='py-4'>
					<label className='block mb-2'>Email</label>
					<Input />
					<p className='mt-2 text-xs text-muted-foreground'>
						An invitation will only be sent if an account exists with the given
						email.
					</p>
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
