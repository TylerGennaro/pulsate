'use client';

import { SignInButton } from '@components/SignButton';
import { ThemeToggle } from '@components/ThemeToggle';
import { Button } from '@components/ui/button';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function LandingHeader() {
	const { data: session } = useSession();
	const [sidebarOpen, setSidebarOpen] = useState(false);
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
	}, [sidebarOpen]);
	return (
		<div
			className='relative grid justify-between w-full grid-cols-2 p-6 border-r lg:grid-cols-3 sm:border-none'
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
				width={64}
				height={64}
				className='hidden lg:block'
			/>
			<div
				className={`absolute top-0 left-0 flex flex-col h-screen gap-4 p-8 pr-32 font-semibold ${
					sidebarOpen ? 'translate-x-0' : '-translate-x-full'
				} duration-300 sm:justify-center transition-transform shadow-md sm:translate-x-0 bg-zinc-100 dark:bg-zinc-900 sm:bg-zinc-50 sm:dark:bg-zinc-950 sm:shadow-none sm:items-center sm:p-0 sm:flex-row sm:h-auto justify-start sm:gap-12 sm:static`}
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
				<Link href='#'>Features</Link>
				<Link href='#'>Pricing</Link>
				<Link href='#'>Testimonials</Link>
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
