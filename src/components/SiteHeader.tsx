'use client';

import { Menu } from 'lucide-react';
import Notifications from './Notifications';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';

export default function SiteHeader({
	sidebarToggle,
	sidebarOpen,
}: {
	sidebarToggle: (open: boolean) => void;
	sidebarOpen: boolean;
}) {
	return (
		<div className='h-16 bg-foreground border-b shadow-md flex items-center justify-between lg:justify-end px-4'>
			<Button
				variant='ghost'
				size='sm'
				className='lg:hidden'
				onClick={() => sidebarToggle(!sidebarOpen)}
			>
				<Menu />
				<span className='sr-only'>Toggle sidebar</span>
			</Button>
			<div>
				<Notifications />
				<ThemeToggle />
			</div>
		</div>
	);
}
