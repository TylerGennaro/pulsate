import Form from '@components/Form';
import { Button } from '@components/ui/button';
import { Checkbox } from '@components/ui/checkbox';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@components/ui/dialog';
import { Input } from '@components/ui/input';
import { Save } from 'lucide-react';

export default function SettingsDialog({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>Change your location settings.</DialogDescription>
				</DialogHeader>
				<div className='grid grid-cols-[min-content_repeat(3,_minmax(0,_1fr))] gap-2 items-center'>
					<label className='col-span-1 text-right'>
						Name
						<span className='ml-1 text-red-500'>*</span>
					</label>
					<Input
						className='col-span-3'
						type='number'
						placeholder='Location name'
						name='location-name'
					/>
					<Checkbox
						id='email-checkouts'
						name='email-checkouts'
						className='ml-auto'
					/>
					<label htmlFor='email-checkouts' className='col-span-3'>
						Send email for every checkout
					</label>
					<Checkbox
						id='checkout-auth-required'
						name='checkout-auth-required'
						className='ml-auto'
					/>
					<label htmlFor='checkout-auth-required' className='col-span-3'>
						Require users to be authenticated before checkout
					</label>
				</div>
				<DialogFooter>
					<Button variant='ghost' onClick={() => setOpen(false)}>
						Close
					</Button>
					<Button icon={Save} onClick={() => setOpen(false)}>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
