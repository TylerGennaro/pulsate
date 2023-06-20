import { Button } from '@components/ui/button';
import Link from 'next/link';
import NavHeader from '@components/NavHeader';
import Plans from './plans/Plans';
import Header from '@components/ui/header';
import Features from './Features';
import HeroHeading from '@components/HeroHeading';
import { ArrowRight } from 'lucide-react';

export default async function Home() {
	return (
		<main className='flex flex-col'>
			<NavHeader>
				<a href='#features'>Features</a>
				<Link href='#pricing'>Pricing</Link>
			</NavHeader>
			<div className='flex flex-col items-center py-16'>
				<div className='flex flex-col items-center h-[80vh] max-w-screen-md gap-2'>
					<Header size='xl' className='text-center'>
						The solution to organizing medical closets
					</Header>
					<span className='w-3/4 text-lg text-center text-muted'>
						Effortlessly organize your medical closet and manage inventory with
						ease using this intuitive solution.
					</span>
					<Link href='/app' className='mt-2 w-fit'>
						<Button className='shadow-md'>Get started</Button>
					</Link>
				</div>
				<Features />
				<div id='pricing' className='flex flex-col items-center py-16'>
					<HeroHeading
						title='Plans designed for you'
						description="Our plans are tailored to your organization's needs. Spend less on closet organization so you can spend more on saving lives."
						className='mb-20'
					>
						<Link href='/plans'>
							<Button className='shadow-md'>
								View plans
								<ArrowRight className='icon-right' />
							</Button>
						</Link>
					</HeroHeading>
					<Plans />
					hr
				</div>
			</div>
		</main>
	);
}
