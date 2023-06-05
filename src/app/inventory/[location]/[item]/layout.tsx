import Header from '@components/ui/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Button } from '@components/ui/button';
import { authOptions } from '@lib/auth';
import { Warehouse } from 'lucide-react';
import { getServerSession } from 'next-auth';

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);
	return (
		<div className='flex grow'>
			<div className='w-1/4 max-w-xs h-full bg-foreground border-r shadow-lg flex flex-col justify-between'>
				<div className='px-8 py-4 flex flex-col gap-8 w-full'>
					<div>
						<Header size='md' className='mt-4'>
							Pulsate
						</Header>
					</div>
					<hr />
					<div className='flex flex-col gap-1'>
						<span className='text-foreground-text/70 text-xs mb-2 font-semibold'>
							Locations
						</span>
						<Button className='justify-start text-foreground-text/70 bg-muted shadow-md text-white hover:bg-muted hover:text-white'>
							<Warehouse className='mr-2' />
							Station 154
						</Button>
						<Button className='justify-start text-foreground-text/70 bg-foreground hover:bg-muted hover:text-white'>
							<Warehouse className='mr-2' />
							Station 155
						</Button>
					</div>
				</div>
				<div className='hover:bg-muted cursor-pointer py-2 px-8 flex gap-4 items-center'>
					<Avatar>
						<AvatarImage src={session?.user?.image || undefined} />
						<AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
					</Avatar>
					<span className='font-semibold text-sm'>{session?.user?.name}</span>
				</div>
			</div>
			<div className='h-[calc(100vh_-_4rem)] grow'>
				<div className='w-full h-full overflow-y-scroll'>{children}</div>
			</div>
		</div>
	);
}
