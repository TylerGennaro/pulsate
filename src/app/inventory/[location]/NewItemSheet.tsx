'use client';

import { Button } from '@components/ui/button';
import InputGroup from '@components/InputGroup';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@components/ui/select';
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
import { useSession } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import { crud, formDataToObject } from '@lib/utils';

export default function NewItemSheet({ location }: { location: string }) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

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
		if (result.status === 200) setOpen(false);
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
					<div className='grid gap-4 py-4 min-w-fit'>
						<InputGroup
							label='Name'
							name='name'
							placeholder='Enter product name'
							required
						/>
						<InputGroup
							label='Min Quantity'
							name='min'
							placeholder='Enter the minimum quantity'
							defaultValue={5}
							type='number'
							desc="When the product's quantity reaches this number, it will be marked as low quantity. Default: 5"
						/>
						<InputGroup
							label='Max Quantity'
							name='max'
							placeholder='Enter the maximum quantity'
							type='number'
							desc='The maximum number of this product that can be stored in this location.'
						/>
						<div className='grid grid-cols-4 items-center gap-y-1'>
							<label className='col-span-1 text-right mr-4'>
								Packaging<span className='text-red-500 ml-1'>*</span>
							</label>
							<div className='col-span-3'>
								<Select name='packageType'>
									<SelectTrigger>
										<SelectValue placeholder='Select the packaging' />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value='single'>Single Item</SelectItem>
											<SelectItem value='pack'>Pack</SelectItem>
											<SelectItem value='box'>Box</SelectItem>
											<SelectItem value='case'>Case</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
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
