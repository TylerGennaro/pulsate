'use client';

import ArrowButton from '@components/ArrowButton';
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
import { Button } from '@components/ui/button';
import { toast } from '@components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { FormEvent, ReactNode, useState } from 'react';

export default function DeleteProduct({
	id,
	children,
}: {
	id: string;
	children: ReactNode;
}) {
	const [alertOpen, setAlertOpen] = useState(false);
	const queryClient = useQueryClient();

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
				if (res.redirected) window.location.replace(res.url);
			} else toast.error('Failed to update product', await res?.text());
		},
	});

	return (
		<AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

			<AlertDialogContent>
				<form onSubmit={deleteMutation.mutate}>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This product and all its data will
							be permanently deleted.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<ArrowButton
							Icon={Trash2}
							type='submit'
							variant='destructive'
							isLoading={deleteMutation.isPending}
						>
							Delete
						</ArrowButton>
					</AlertDialogFooter>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
}
