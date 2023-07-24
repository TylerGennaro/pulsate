'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Nav } from './Nav';
import { signOut, useSession } from 'next-auth/react';
import { Skeleton } from './ui/skeleton';
import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { LogOut, X } from 'lucide-react';
import { SignInButton } from './SignButton';
import Logo from './Logo';

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
	}, [open]);
	return (
		<div
			className={`flex w-80 h-[100dvh] fixed lg:sticky top-0 left-0 bottom-0 bg-zinc-50 dark:bg-zinc-900 border-r shadow-lg flex-col justify-between z-40 shrink-0 overflow-auto lg:translate-x-0 lg:opacity-100 transition-all duration-300 ${
				open ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
			}`}
			ref={sidebarRef}
		>
			<Button
				className='absolute lg:hidden top-4 right-4'
				variant='ghost'
				onClick={() => toggle(false)}
			>
				<X />
			</Button>
			<div className='flex flex-col w-full gap-8 px-8 py-4'>
				<Logo className='mt-4' />
				<hr />
				<Nav locations={locations} toggle={toggle} />
			</div>
			<div className='flex items-center justify-between gap-2 p-2'>
				{status === 'loading' && (
					<div className='flex items-center gap-4'>
						<Skeleton className='w-10 h-10 rounded-full' />
						<Skeleton className='h-6 w-36' />
					</div>
				)}
				{status === 'unauthenticated' && <SignInButton className='w-full' />}
				{status === 'authenticated' && (
					<>
						<div className='flex items-center gap-4 px-2 py-1 rounded cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 grow'>
							<Avatar>
								<AvatarImage src={session?.user.image || undefined} />
								<AvatarFallback>{session?.user.name?.[0]}</AvatarFallback>
							</Avatar>
							<span className='text-sm font-semibold'>
								{session?.user.name}
							</span>
						</div>
						<Button
							variant='ghost'
							className='text-red-500 hover:text-red-400 hover:bg-red-400/20'
							onClick={() => signOut()}
						>
							<LogOut />
						</Button>
					</>
				)}
			</div>
		</div>
	);
}
