'use client';

import { addProduct } from '@actions/product';
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
import { toast } from '@components/ui/use-toast';
import { formDataToObject, parseFormData } from '@lib/utils';
import { Plus } from 'lucide-react';
import { FormEvent, useState, useTransition } from 'react';
import ProductForm from './ProductForm';

export default function NewProduct({ locationId }: { locationId: string }) {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		startTransition(async () => {
			const data = formDataToObject(parseFormData(event));
			const response = await addProduct(locationId, data);
			if (!response.ok) {
				toast.error('Failed to add product', response.message);
				return;
			}
			toast.success('Product added.');
			setOpen(false);
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant='primary'>
					<Plus className='icon-left' />
					New Product
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Add New Product</DialogTitle>
						<DialogDescription>
							Add a new inventory product. All information entered can be
							changed later.
						</DialogDescription>
					</DialogHeader>
					<ProductForm />
					<DialogFooter>
						<ArrowButton
							className='ml-auto'
							type='submit'
							Icon={Plus}
							isLoading={isPending}
							variant='primary'
						>
							Add
						</ArrowButton>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
