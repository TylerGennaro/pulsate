'use client';

import { Menu } from 'lucide-react';
import Notifications from './Notifications';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { cn } from '@lib/utils';
import { useSession } from 'next-auth/react';
import { Skeleton } from './ui/skeleton';
import { SignInButton, SignOutButton } from './SignButton';
import { usePathname } from 'next/navigation';

export default function SiteHeader({
	sidebarToggle,
	sidebarOpen,
	children,
	className,
	showSignIn = false,
}: {
	sidebarToggle?: (open: boolean) => void;
	sidebarOpen?: boolean;
	children?: React.ReactNode;
	className?: string;
	showSignIn?: boolean;
}) {
	const { status } = useSession();
	return (
		<div
			className={cn(
				`w-full sticky top-0 h-16 bg-zinc-50 dark:bg-zinc-900 border-b shadow-md flex items-center justify-between ${
					sidebarToggle && 'lg:justify-end'
				} px-4 z-30`,
				className
			)}
		>
			{sidebarToggle && (
				<Button
					variant='ghost'
					size='sm'
					className='lg:hidden sidebar-toggle'
					onClick={() => sidebarToggle(!sidebarOpen)}
				>
					<Menu className='pointer-events-none' />
					<span className='sr-only'>Toggle sidebar</span>
				</Button>
			)}
			{children !== undefined && (
				<div className='flex gap-4 font-semibold justify-self-start text-muted'>
					{children}
				</div>
			)}
			<div className='flex items-center gap-2'>
				{showSignIn ? (
					<>
						{status === 'authenticated' && (
							<>
								<SignOutButton />
								<Notifications />
							</>
						)}
						{status === 'unauthenticated' && <SignInButton />}
						{status === 'loading' && <Skeleton className='w-32 h-10' />}
					</>
				) : (
					<Notifications />
				)}
				<ThemeToggle />
			</div>
		</div>
	);
}
