'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@components/ui/alert-dialog';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { useRef, useState } from 'react';

function CheckItem({
	amount = 1,
	name,
	out,
}: {
	amount?: number;
	name: string;
	out?: boolean;
}) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button className='text-xl p-6' variant={out ? 'default' : 'outline'}>
					I {out ? 'took ' + amount + ' out' : 'put ' + amount + ' back'}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action will be logged in the system. {amount} {name}(s) will be
						checked {out ? 'out of' : 'in to'} inventory.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction>Yes, check {out ? 'out' : 'in'}</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default function EditInventory({ name }: { name: string }) {
	const [amount, setAmount] = useState(1);
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<>
			<Input
				defaultValue={1}
				type='number'
				className='max-w-[200px] text-lg mb-2'
				ref={inputRef}
				onChange={(event) => setAmount(parseInt(event.target.value) || 1)}
				onFocus={() => inputRef.current?.select()}
			/>
			<CheckItem amount={amount} name={name} out />
			<CheckItem amount={amount} name={name} />
		</>
	);
}
