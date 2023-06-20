'use client';

import { SignInButton } from '@components/SignButton';
import { ThemeToggle } from '@components/ThemeToggle';
import { Button } from '@components/ui/button';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function NavHeader({ children }: { children: React.ReactNode }) {
	const { data: session } = useSession();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const sidebarRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		window.addEventListener('resize', () => {
			if (sidebarOpen) setSidebarOpen(false);
		});
		window.addEventListener('click', (e) => {
			const target = e.target as Element;
			if (
				sidebarOpen &&
				!sidebarRef.current?.contains(e.target as Node) &&
				(typeof target.className !== 'string' ||
					!target.className.includes('sidebar-toggle'))
			)
				setSidebarOpen(false);
		});
		window.addEventListener('scroll', () => {
			if (window.scrollY > 0) setScrolled(true);
			else setScrolled(false);
		});
	}, [sidebarOpen]);
	return (
		<div
			className={`sticky top-0 z-50 grid items-center justify-between w-full bg-zinc-100 dark:bg-zinc-950 grid-cols-2 px-8 py-4 border-r lg:grid-cols-3 sm:border-none transition-shadow ${
				scrolled ? 'shadow-md sm:border-b' : ''
			}`}
			ref={sidebarRef}
		>
			<Button
				variant='ghost'
				className='sm:hidden justify-self-start sidebar-toggle'
				onClick={() => setSidebarOpen(!sidebarOpen)}
			>
				<Menu />
			</Button>
			<Image
				src='/logo.svg'
				alt='logo'
				width={32}
				height={32}
				className='hidden lg:block'
			/>
			<div
				className={`absolute top-0 left-0 flex flex-col h-screen gap-4 p-8 pr-32 font-semibold ${
					sidebarOpen ? 'translate-x-0' : '-translate-x-full'
				} duration-300 sm:justify-center transition-transform shadow-md sm:translate-x-0 bg-zinc-50 dark:bg-zinc-900 sm:bg-zinc-100 sm:dark:bg-zinc-950 sm:shadow-none sm:items-center sm:p-0 sm:flex-row sm:h-auto justify-start sm:gap-12 sm:static z-10`}
			>
				<Button
					variant='ghost'
					className='absolute p-1 top-2 right-2 sm:hidden'
					onClick={() => setSidebarOpen(false)}
				>
					<X />
				</Button>
				<div className='relative sm:hidden'>
					<Image src='/logo.svg' alt='logo' width={64} height={64} />
					<hr className='my-4' />
				</div>
				{children}
			</div>
			<div className='flex items-center justify-end gap-2'>
				<ThemeToggle />
				{session ? (
					<Link href='/app'>
						<Button variant='outline'>Dashboard</Button>
					</Link>
				) : (
					<SignInButton variant='outline'>
						Sign In
						<ArrowRight className='w-4 h-4 ml-2' />
					</SignInButton>
				)}
			</div>
		</div>
	);
}
