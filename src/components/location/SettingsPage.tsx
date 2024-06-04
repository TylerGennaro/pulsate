import PlusButton from '@components/PlusButton';
import { Button } from '@components/ui/button';
import Header from '@components/ui/header';
import { Skeleton } from '@components/ui/skeleton';
import { Plus } from 'lucide-react';
import AddUserPermissionDialog from './AddUserPermissionDialog';

export default function SettingsPage() {
	return (
		<>
			<div className='flex justify-between mb-6'>
				<Header size='sm' weight='medium'>
					Permissions
				</Header>
				<AddUserPermissionDialog>
					<Button variant='flat' size='icon'>
						<Plus />
					</Button>
				</AddUserPermissionDialog>
			</div>
			<div className='flex justify-center'>
				{/* <PlusButton>Add user</PlusButton> */}
				<ul className='flex justify-start w-full'>
					<li className='flex items-center gap-4'>
						<Skeleton className='w-12 h-12 rounded-full' />
						<div className='flex flex-col gap-1'>
							<span className='font-medium'>Tyler Gennaro</span>
							<span className='text-sm'>tylergennaro10@gmail.com</span>
						</div>
					</li>
				</ul>
			</div>
		</>
	);
}
