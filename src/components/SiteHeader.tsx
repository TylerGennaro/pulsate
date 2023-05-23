import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { SignInButton } from './SignButton';
import { getServerSession } from 'next-auth';
import SiteProfile from './SiteProfile';
import { Nav } from './Nav';

export default async function SiteHeader() {
	const session = await getServerSession();

	return (
		<header className='sticky top-0 w-full z-40 border-b bg-background'>
			<div className='container flex h-16 items-center space-x-4 justify-between'>
				<div className='flex gap-6 md:gap-10'>
					<Link href='/' className='hidden items-center space-x-2 md:flex'>
						<span className='hidden font-bold text-xl sm:inline-block'>
							LFHRS
						</span>
					</Link>
					<Nav />
				</div>
				<div className='flex items-center gap-2'>
					{session ? (
						<>
							<p className='text-sm text-muted-foreground font-semibold mr-2'>
								{session?.user?.name}
							</p>
							{/* @ts-expect-error */}
							<SiteProfile />
						</>
					) : (
						<>
							<ThemeToggle />
							<SignInButton />
						</>
					)}
				</div>
			</div>
		</header>
	);
}
