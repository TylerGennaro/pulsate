'use client';

import { Menu } from 'lucide-react';
import Notifications from './Notifications';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { cn } from '@lib/utils';
import { useSession } from 'next-auth/react';
import { Skeleton } from './ui/skeleton';
import { SignInButton } from './SignButton';
import Link from 'next/link';

export default function SiteHeader({
	sidebarToggle,
	sidebarOpen,
	children,
	className,
	showDashboard = false,
}: {
	sidebarToggle?: (open: boolean) => void;
	sidebarOpen?: boolean;
	children?: React.ReactNode;
	className?: string;
	showDashboard?: boolean;
}) {
	const { status } = useSession();
	return (
		<div
			className={cn(
				'w-full sticky top-0 h-16 bg-content border-b shadow-md z-30',
				className
			)}
		>
			<div
				className={`h-full flex items-center justify-between px-4 max-w-screen-2xl mx-auto ${
					sidebarToggle && 'lg:justify-end'
				}`}
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
					<div className='flex gap-4 font-semibold justify-self-start text-muted-foreground'>
						{children}
					</div>
				)}
				<div className='flex items-center gap-2'>
					{showDashboard ? (
						<>
							{status === 'authenticated' && (
								<>
									<Link href='/app'>
										<Button variant='outline'>Dashboard</Button>
									</Link>
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
		</div>
	);
}
