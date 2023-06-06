'use client';

import Header from '@components/ui/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Nav } from './Nav';
import { useSession } from 'next-auth/react';
import { Skeleton } from './ui/skeleton';
import { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { Button } from './ui/button';
import { X } from 'lucide-react';

export default function Sidebar({
	open,
	toggle,
	locations,
}: {
	open: boolean;
	toggle: (open: boolean) => void;
	locations: LocationInfo[] | null;
}) {
	const { data: session, status } = useSession();
	return (
		<div
			className={`${
				open ? 'flex' : 'hidden'
			} lg:flex w-80 h-full bg-foreground border-r shadow-lg flex-col justify-between z-40 shrink-0 absolute lg:relative`}
		>
			<Button
				className='lg:hidden absolute top-4 right-4'
				variant='ghost'
				onClick={() => toggle(false)}
			>
				<X />
			</Button>
			<div className='px-8 py-4 flex flex-col gap-8 w-full'>
				<div>
					<Header size='md' className='mt-4'>
						Pulsate
					</Header>
				</div>
				<hr />
				<Nav locations={locations} />
			</div>
			{status === 'loading' ? (
				<Skeleton className='w-full h-12 rounded-none' />
			) : (
				<div className='hover:bg-muted cursor-pointer py-2 px-8 flex gap-4 items-center'>
					<Avatar>
						<AvatarImage src={session?.user.image || undefined} />
						<AvatarFallback>{session?.user.name?.[0]}</AvatarFallback>
					</Avatar>
					<span className='font-semibold text-sm'>{session?.user.name}</span>
				</div>
			)}
		</div>
	);
}
