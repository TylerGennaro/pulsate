'use client';

import ArrowButton from '@components/ArrowButton';
import ProductForm from '@components/location/ProductForm';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';
import { PackageType } from '@lib/enum';
import { parseFormData } from '@lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';

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
			} else toast.error('Failed to update product: ' + (await res?.text()));
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
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