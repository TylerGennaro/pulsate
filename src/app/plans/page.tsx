import Header from '@components/ui/header';
import { Button } from '@components/ui/button';
import { ArrowRight } from 'lucide-react';
import FAQ from './FAQ';
import CompareTable from './CompareTable';
import NavHeader from '@components/NavHeader';
import Link from 'next/link';
import Plans from './Plans';
import { populateMetadata } from '@lib/utils';
import HeroHeading from '@components/HeroHeading';

export const metadata = populateMetadata('Plans and Pricing');

const links = [
	{ label: 'Home', href: '/' },
	{ label: 'Plans', href: '#compare' },
	{ label: 'FAQ', href: '#faq' },
];

export default function Page() {
	return (
		<main className='flex flex-col scroll-smooth'>
			<NavHeader items={links} />
			<div className='container flex flex-col items-center gap-32 py-16'>
				<div className='flex justify-center w-full'>
					<div className='flex flex-col items-center max-w-screen-md gap-2'>
						<HeroHeading
							title='Plans suited for your needs'
							description="Choose the best plan for your organization and don't overpay. Plans are differentiated by scale and features."
						>
							<a href='#faq'>
								<Button variant='outline'>FAQ</Button>
							</a>
							<a href='#compare'>
								<Button variant='primary'>
									Compare Plans
									<ArrowRight className='w-4 h-4 ml-2' />
								</Button>
							</a>
						</HeroHeading>
					</div>
				</div>
				<Plans />
				<CompareTable />
				<FAQ />
			</div>
		</main>
	);
}
