'use client';

import { Button } from '@components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@components/ui/sheet';
import { Plus } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { crud, formDataToObject } from '@lib/utils';
import ProductForm from './ProductForm';
import { useRouter } from 'next/navigation';

export default function NewItemSheet({ location }: { location: string }) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		const data = new FormData(e.currentTarget);
		data.append('locationId', location);
		const result = await crud({
			url: '/products',
			method: 'POST',
			data: formDataToObject(data),
		});
		if (result.status === 200) {
			setOpen(false);
			router.refresh();
		}
		setLoading(false);
	}
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button>
					<Plus className='w-4 h-4 mr-2' />
					New Product
				</Button>
			</SheetTrigger>
			<SheetContent size='content'>
				<form onSubmit={submit}>
					<SheetHeader>
						<SheetTitle>Add New Product</SheetTitle>
						<SheetDescription>
							Add a new inventory product. All information entered can be
							changed later.
						</SheetDescription>
					</SheetHeader>
					<ProductForm />
					<SheetFooter>
						<Button
							className='ml-auto'
							type='submit'
							icon={Plus}
							isLoading={loading}
						>
							Add
						</Button>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
