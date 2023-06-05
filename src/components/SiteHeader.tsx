import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { SignInButton } from './SignButton';
import { getServerSession } from 'next-auth';
import SiteProfile from './SiteProfile';
import { Nav } from './Nav';

export default async function SiteHeader() {
	const session = await getServerSession();

	return (
		<header className='w-full h-16 border-b bg-foreground shadow-lg z-40'>
			<div className='container h-16 flex items-center space-x-4 justify-between'>
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
							<p className='text-sm text-muted-text font-semibold mr-2'>
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
