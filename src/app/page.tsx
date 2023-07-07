import { Button } from '@components/ui/button';
import Link from 'next/link';
import NavHeader from '@components/NavHeader';
import Plans from './plans/Plans';
import Features from './Features';
import HeroHeading from '@components/HeroHeading';
import { ArrowRight } from 'lucide-react';
import { Patterns } from '@components/BackgroundPattern';
import { Metadata } from 'next';
import { populateMetadata } from '@lib/utils';

export const metadata = populateMetadata('Home');

const links = [
	{ label: 'Features', href: '#features' },
	{ label: 'Pricing', href: '#pricing' },
];

export default function Home() {
	return (
		<main className='flex flex-col'>
			<NavHeader items={links} />
			<div className='flex flex-col items-center pb-16 bg-zinc-50 dark:bg-zinc-950'>
				<div className='h-[100vh] w-full grid place-content-center px-8'>
					<HeroHeading
						title='The solution to organizing medical closets'
						description='Effortlessly organize your medical closet and manage inventory with
						ease using this intuitive solution.'
					>
						<Link href='/app' className='mt-2 w-fit'>
							<Button className='shadow-md'>Get started</Button>
						</Link>
					</HeroHeading>
				</div>
				<Features />
				<div id='pricing' className='flex flex-col items-center px-8 py-16'>
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
				</div>
			</div>
		</main>
	);
}
