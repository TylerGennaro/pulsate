import { SignInButton } from '@components/SignButton';
import { Button } from '@components/ui/button';
import { authOptions } from '@lib/auth';
import { ArrowRight } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
	const session = await getServerSession(authOptions);
	return (
		<main className='min-h-screen flex flex-col items-center'>
			<div className='w-full flex justify-between items-center p-6'>
				<Image src='/logo.svg' alt='logo' width={64} height={64} />
				<div className='flex gap-12 font-semibold'>
					<Link href='#'>Features</Link>
					<Link href='#'>Pricing</Link>
					<Link href='#'>Testimonials</Link>
				</div>
				{session ? (
					<Link href='/inventory'>
						<Button variant='outline'>Dashboard</Button>
					</Link>
				) : (
					<SignInButton variant='outline'>
						Sign In
						<ArrowRight className='w-4 h-4 ml-2' />
					</SignInButton>
				)}
			</div>
			<div className='grid place-content-center grow max-w-screen-sm text-center'>
				<h1 className='text-5xl font-bold'>
					The solution to organizing medical closets
				</h1>
				<h3 className='mt-4 text-muted-text text-xl'>
					Effortlessly organize your medical closet and manage inventory with
					ease using this intuitive solution.
				</h3>
				<Link href='/inventory'>
					<Button className='mt-8 w-fit mx-auto'>Get started</Button>
				</Link>
			</div>
		</main>
	);
}
