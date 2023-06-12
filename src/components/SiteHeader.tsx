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
}: {
	sidebarToggle?: (open: boolean) => void;
	sidebarOpen?: boolean;
	children?: React.ReactNode;
	className?: string;
}) {
	const { status } = useSession();
	return (
		<div
			className={cn(
				`w-full h-16 bg-foreground border-b shadow-md flex items-center justify-between ${
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
				<div className='flex gap-4 justify-self-start font-semibold text-muted-text'>
					{children}
				</div>
			)}
			<div className='flex gap-2 items-center'>
				{status === 'authenticated' && <SignOutButton redirect={false} />}
				{status === 'unauthenticated' && <SignInButton redirect={false} />}
				{status === 'loading' && <Skeleton className='w-32 h-10' />}
				<Notifications />
				<ThemeToggle />
			</div>
		</div>
	);
}
