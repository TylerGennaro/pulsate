import HeroHeading from '@components/HeroHeading';
import NavHeader from '@components/NavHeader';
import { Button } from '@components/ui/button';
import { populateMetadata } from '@lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Features from './Features';
import Plans from './plans/Plans';
import ArrowButton from '@components/ArrowButton';

export const metadata = populateMetadata();

const links = [
	{ label: 'Features', href: '#features' },
	{ label: 'Pricing', href: '#pricing' },
];

export default function Home() {
	return (
		<main className='flex flex-col'>
			<div className='absolute top-0 left-1/2 -translate-x-1/2 container h-[100vh] overflow-x-hidden z-[1] pointer-events-none'>
				<div className='absolute bg-primary/40 dark:bg-[#333] w-[1000px] h-[70px] rotate-[60deg] -left-96 sm:-left-60 lg:-left-20 top-40 blur-[80px] rounded-[50%]' />
				<div className='hidden md:block absolute bg-primary/40 dark:bg-[#333] w-[800px] h-[55px] rotate-45 left-1/3 top-20 blur-[80px] rounded-[50%]' />
			</div>
			<NavHeader items={links} />
			<div className='flex flex-col items-center pb-16 mt-10'>
				<div className='container flex justify-center px-0 pt-32'>
					<HeroHeading
						title='The solution to organizing medical closets'
						description='Effortlessly organize your medical closet and manage inventory with
						ease using our intuitive solution. Take control of your closet using the power of automation.'
						size='3xl'
					>
						<Link href='/app' className='mt-2 w-fit'>
							<Button className='shadow-md group' variant='primary'>
								Get started
								<ArrowRight className='transition-transform icon-right group-hover:translate-x-1' />
							</Button>
						</Link>
					</HeroHeading>
				</div>
				<div className='container relative z-10 my-16'>
					<img
						src='/dashboard.png'
						alt='Dashboard'
						className='hidden object-contain w-full border rounded-lg shadow-white/5 shadow-[0_0_20px] dark:block appear-up delay-400'
					/>
					<img
						src='/dashboard_light.png'
						alt='Dashboard'
						className='object-contain w-full border rounded-lg shadow-lg delay-400 dark:hidden appear-up'
					/>
				</div>
				<Features />
				<div id='pricing' className='flex flex-col items-center px-8 py-16'>
					<HeroHeading
						title='Plans designed for you'
						description="Our plans are tailored to your organization's needs. Spend less on closet organization so you can spend more on saving lives."
						className='mb-20'
					>
						<Link href='/plans'>
							<ArrowButton variant='primary' className='shadow-md'>
								View plans
							</ArrowButton>
						</Link>
					</HeroHeading>
					<Plans />
				</div>
			</div>
		</main>
	);
}
