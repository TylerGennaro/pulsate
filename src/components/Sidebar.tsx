'use client';

import Header from '@components/ui/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Nav } from './Nav';
import { useSession } from 'next-auth/react';
import { Skeleton } from './ui/skeleton';
import { useEffect, useRef, useState } from 'react';
import { Session } from 'next-auth';
import { Button } from './ui/button';
import { LogOut, X } from 'lucide-react';

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
	const sidebarRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		window.addEventListener('resize', () => {
			if (open) toggle(false);
		});
		window.addEventListener('click', (e) => {
			const target = e.target as Element;
			if (
				open &&
				!sidebarRef.current?.contains(e.target as Node) &&
				(typeof target.className !== 'string' ||
					!target.className.includes('sidebar-toggle'))
			)
				toggle(false);
		});
	}, []);
	return (
		<div
			className={`flex w-80 h-full bg-foreground border-r shadow-lg flex-col justify-between z-40 shrink-0 absolute lg:left-0 lg:opacity-100 lg:relative transition-all duration-300 ${
				open ? 'left-0 opacity-100' : '-left-80 opacity-0'
			}`}
			ref={sidebarRef}
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
				<Nav locations={locations} toggle={toggle} />
			</div>
			{status === 'loading' ? (
				<Skeleton className='w-full h-12 rounded-none' />
			) : (
				<div className='flex justify-between p-2 gap-2 items-center'>
					<div className='hover:bg-muted cursor-pointer py-1 px-2 flex gap-4 items-center rounded grow'>
						<Avatar>
							<AvatarImage src={session?.user.image || undefined} />
							<AvatarFallback>{session?.user.name?.[0]}</AvatarFallback>
						</Avatar>
						<span className='font-semibold text-sm'>{session?.user.name}</span>
					</div>
					<Button variant='ghost'>
						<LogOut />
					</Button>
				</div>
			)}
		</div>
	);
}
