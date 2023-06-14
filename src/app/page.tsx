import { Button } from '@components/ui/button';
import Link from 'next/link';
import LandingHeader from './LandingHeader';

export default async function Home() {
	return (
		<main className='flex flex-col items-center min-h-screen bg-zinc-50 dark:bg-zinc-900'>
			<LandingHeader />
			<div className='grid max-w-screen-sm p-4 text-center place-content-center grow'>
				<h1 className='text-5xl font-bold'>
					The solution to organizing medical closets
				</h1>
				<h3 className='mt-4 text-xl text-muted'>
					Effortlessly organize your medical closet and manage inventory with
					ease using this intuitive solution.
				</h3>
				<Link href='/app' className='mx-auto mt-8 w-fit'>
					<Button className='shadow-md'>Get started</Button>
				</Link>
			</div>
		</main>
	);
}
