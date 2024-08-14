import Image from 'next/image';
import { CheckoutUser } from '../DashboardModules';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';

export default function CheckoutUsers({ data }: { data: CheckoutUser[] }) {
	return (
		<ul className='mt-8 animate-[fade-in_500ms]'>
			{data.map((user, i) => (
				<li
					key={i}
					className='flex items-center justify-between py-4 border-b last-of-type:border-none'
				>
					<div className='flex items-center gap-4'>
						<Avatar>
							<AvatarImage src={user.image || undefined} />
							<AvatarFallback>{user.name[0]}</AvatarFallback>
						</Avatar>
						<div>
							<p>{user.name}</p>
							<p className='text-muted-foreground'>{user.email}</p>
						</div>
					</div>
					<p className='text-muted-foreground'>{user.quantity} items</p>
				</li>
			))}
		</ul>
	);
}
