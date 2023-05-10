import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
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

interface InputGroupProps {
	label: string;
	placeholder?: string;
	defaultValue?: string;
	required?: boolean;
}

function InputGroup({
	label,
	placeholder,
	defaultValue,
	required,
}: InputGroupProps) {
	return (
		<div className='grid grid-cols-4 items-center gap-4'>
			<label className='col-span-1 text-right'>
				{label}
				{required && <span className='text-red-500 ml-1'>*</span>}
			</label>
			<Input
				className='col-span-3'
				placeholder={placeholder}
				defaultValue={defaultValue}
			/>
		</div>
	);
}

export default function NewItemSheet() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button className='fixed bottom-8 right-8 p-3 h-auto rounded-full shadow-xl'>
					<Plus />
				</Button>
			</SheetTrigger>
			<SheetContent size='content'>
				<SheetHeader>
					<SheetTitle>Add New Item</SheetTitle>
					<SheetDescription>
						Add a new inventory item. All information entered can be changed
						later.
					</SheetDescription>
				</SheetHeader>
				<div className='grid gap-4 py-4 min-w-fit'>
					<InputGroup label='Name' placeholder='Enter item name' required />
					<InputGroup
						label='Quantity'
						placeholder='Enter initial quantity'
						required
					/>
					<InputGroup
						label='Expiration'
						placeholder='Enter earliest expiration date'
					/>
				</div>
				<SheetFooter>
					<Button className='ml-auto'>
						<Plus className='w-4 h-4 mr-2' />
						Add
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
