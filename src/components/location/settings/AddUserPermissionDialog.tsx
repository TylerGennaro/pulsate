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
import { toast } from '@components/ui/use-toast';
import { Mail } from 'lucide-react';
import { FormEvent, ReactNode, useState, useTransition } from 'react';

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

	const handleSend = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		startTransition(async () => {
			const response = await sendLocationShareInvitation(
				emailInput,
				locationId
			);
			if (!response.ok) {
				toast.error('Failed to send invitation.', response.message);
				return;
			}
			toast.success('Success', "Invitation sent to user's email.");
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
				<form onSubmit={handleSend}>
					<hr className='mt-1' />
					<div className='py-4'>
						<label className='block mb-2'>Email</label>
						<Input
							value={emailInput}
							onChange={(event) => setEmailInput(event.target.value)}
						/>
						<p className='mt-2 text-xs text-muted-foreground'>
							An invitation will only be sent if an account exists with the
							given email.
						</p>
					</div>
					<DialogFooter>
						<Button onClick={() => setDialogOpen(false)}>Cancel</Button>
						<ArrowButton
							type='submit'
							Icon={Mail}
							variant='primary'
							isLoading={isPending}
						>
							Send Invitation
						</ArrowButton>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
