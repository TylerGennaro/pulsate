'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type LinkTabsProps = {
	children: ReactNode;
};

export function LinkTabs({ children }: LinkTabsProps) {
	return <div className='mb-8 border-b'>{children}</div>;
}

type LinkTabTriggerProps = {
	href: string;
	children: ReactNode;
};

export function LinkTabTrigger({ href, children }: LinkTabTriggerProps) {
	const pathname = usePathname();
	const isActive = pathname === href;

	return (
		<Link
			href={href}
			prefetch
			className={`text-muted-foreground relative inline-flex items-center justify-center whitespace-nowrap
			pt-1.5 pb-3 px-4 text-base font-medium ring-offset-background transition-all
			focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
			focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
			data-[state=active]:text-foreground before:bottom-0 before:left-0 before:w-full
			before:h-0.5 before:bg-primary before:absolute before:opacity-0 before:rounded-md
			before:transition-opacity data-[state=active]:before:opacity-100`}
			data-state={isActive ? 'active' : ''}
		>
			{children}
		</Link>
	);
}

type LinkTabPanelProps = {
	children: ReactNode;
};

export function LinkTabPanel({ children }: LinkTabPanelProps) {
	return <div>{children}</div>;
}
