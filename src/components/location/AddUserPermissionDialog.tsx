import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';
import { Input } from '@components/ui/input';

type AddUserPermissionDialogProps = {
	children: React.ReactNode;
};

export default function AddUserPermissionDialog({
	children,
}: AddUserPermissionDialogProps) {
	return (
		<Dialog>
			<DialogTrigger>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add User to Location</DialogTitle>
					<DialogDescription className='block'>
						Search by name to give a user permission to access this location.
					</DialogDescription>
				</DialogHeader>
				<hr className='mt-1 mb-4' />
				<div>
					<Input placeholder='Search by name' />
				</div>
			</DialogContent>
		</Dialog>
	);
}
