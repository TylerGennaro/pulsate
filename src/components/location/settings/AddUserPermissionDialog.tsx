'use client';

import { sendLocationShareInvitation } from '@actions/location-share';
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
import { ReactNode, useState, useTransition } from 'react';
import toast from 'react-hot-toast';

type AddUserPermissionDialogProps = {
	children: ReactNode;
	locationId: string;
};

export default function AddUserPermissionDialog({
	children,
	locationId,
}: AddUserPermissionDialogProps) {
	const [isPending, startTransition] = useTransition();
	const [emailInput, setEmailInput] = useState('');
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleSend = async () => {
		startTransition(async () => {
			const response = await sendLocationShareInvitation(
				emailInput,
				locationId
			);
			if (!response.ok) {
				toast.error('Failed to send invitation. Please try again.');
				return;
			}
			toast.success('Invitation sent successfully.');
			setDialogOpen(false);
			setEmailInput('');
		});
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
					<Input
						value={emailInput}
						onChange={(event) => setEmailInput(event.target.value)}
					/>
					<p className='mt-2 text-xs text-muted-foreground'>
						An invitation will only be sent if an account exists with the given
						email.
					</p>
				</div>
				<DialogFooter>
					<Button onClick={() => setDialogOpen(false)}>Cancel</Button>
					<ArrowButton
						Icon={Mail}
						variant='primary'
						onClick={handleSend}
						isLoading={isPending}
					>
						Send Invitation
					</ArrowButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
