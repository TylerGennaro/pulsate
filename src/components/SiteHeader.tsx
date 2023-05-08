import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';

const navItems = {
	Home: '/',
	Inventory: '/inventory',
};

export default function SiteHeader() {
	return (
		<header className='sticky top-0 w-full z-40 border-b bg-background'>
			<div className='container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0'>
				<div className='flex gap-6 md:gap-10'>
					<Link href='/' className='hidden items-center space-x-2 md:flex'>
						<span className='hidden font-bold text-xl sm:inline-block'>
							BCRS
						</span>
					</Link>
					<nav className='hidden gap-6 md:flex'>
						{Object.entries(navItems).map(([name, href]) => (
							<Link
								key={name}
								href={href}
								className='flex items-center text-lg font-semibold text-muted-foreground sm:text-sm'
							>
								{name}
							</Link>
						))}
					</nav>
				</div>
				<div className='flex items-center gap-2'>
					<ThemeToggle />
					<Button>Sign In</Button>
				</div>
			</div>
		</header>
	);
}
