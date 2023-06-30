'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
	{
		name: 'Account',
		href: '/',
	},
	{
		name: 'Billing',
		href: '/billing',
	},
];

export default function Nav() {
	const path = usePathname();
	return (
		<div className='px-8 py-4 border-b'>
			<ul className='flex gap-4 font-semibold text-muted'>
				{navItems.map((item) => (
					<li
						key={item.name}
						className={`px-4 py-1 rounded-md ${
							(item.href !== '/' && path.includes(`/settings${item.href}`)) ||
							(path.endsWith('/settings') && item.href === '/')
								? 'text-blue-600 dark:text-blue-500 bg-blue-700/20 dark:bg-blue-600/20'
								: ''
						}`}
					>
						<Link href={`/app/settings${item.href}`}>{item.name}</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
