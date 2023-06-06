import { Bell } from 'lucide-react';
import { Button } from './ui/button';

export default function Notifications() {
	return (
		<Button variant='ghost' size='sm'>
			<Bell />
			<span className='sr-only'>Toggle notifications</span>
		</Button>
	);
}
