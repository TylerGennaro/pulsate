'use client';

import ArrowButton from '@components/ArrowButton';
import { Button } from '@components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';
import { toast } from '@components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteLocationDialog({
	locationId,
}: {
	locationId: string;
}) {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();
	const router = useRouter();
	const { mutate, isPending } = useMutation({
		mutationFn: async () => {
			return fetch(`/api/locations?id=${locationId}`, {
				method: 'DELETE',
			});
		},
		onSuccess: async (res) => {
			if (res.ok) {
				setOpen(false);
				queryClient.invalidateQueries({ queryKey: ['locations'] });
				if (res.redirected) window.location.replace(res.url);
			} else {
				console.error(await res.json());
				toast.error('Failed to delete location.');
			}
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<ArrowButton
					Icon={Trash}
					variant='destructive'
					onClick={() => setOpen(true)}
				>
					Delete Location
				</ArrowButton>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Delete Location</DialogTitle>
				<DialogDescription>
					Are you sure you want to delete this location?{' '}
					<b>All data associated with this location will be deleted.</b> This is
					irreversible!
				</DialogDescription>
				<DialogFooter>
					<div className='flex justify-end gap-2'>
						<Button variant='outline' onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<ArrowButton
							Icon={Trash}
							onClick={() => mutate()}
							variant='destructive'
							isLoading={isPending}
						>
							Delete
						</ArrowButton>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
