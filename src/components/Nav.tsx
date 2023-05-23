'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = {
	Home: '/',
	Inventory: '/inventory',
};

export function Nav() {
	const pathname = usePathname();
	return (
		<nav className='hidden gap-6 md:flex'>
			{Object.entries(navItems).map(([name, href]) => (
				<Link
					key={name}
					href={href}
					className={`flex items-center text-lg font-semibold ${
						(href === '/' && pathname === '/') ||
						(href !== '/' && pathname.startsWith(href))
							? 'text-white'
							: 'text-muted-foreground'
					} sm:text-sm`}
				>
					{name}
				</Link>
			))}
		</nav>
	);
}
