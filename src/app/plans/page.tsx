import Header from '@components/ui/header';
import PlanCard from './PlanCard';
import { Button } from '@components/ui/button';
import { ArrowRight } from 'lucide-react';
import FAQ from './FAQ';
import CompareTable from './CompareTable';
import { Metadata } from 'next';
import NavHeader from '@components/NavHeader';
import Link from 'next/link';
import Plans from './Plans';

export const metadata: Metadata = {
	title: 'Plans and Pricing | Pulsate',
	description:
		"Choose the best plan for your organization and don't overpay. Plans are differentiated by scale and features.",
};

export default function Page() {
	return (
		<main className='flex flex-col scroll-smooth'>
			<NavHeader>
				<Link href='/'>Home</Link>
				<a href='#compare'>Plans</a>
				<a href='#faq'>FAQ</a>
			</NavHeader>
			<div className='container flex flex-col items-center gap-32 py-16'>
				<div className='flex justify-center w-full'>
					<div className='flex flex-col items-center max-w-screen-md gap-2'>
						<Header size='xl' className='text-center'>
							Plans suited for your needs
						</Header>
						<span className='w-3/4 text-center text-muted'>
							Choose the best plan for your organization and don&apos;t overpay.
							Plans are differentiated by scale and features.
						</span>
						<div className='flex gap-2 mt-2'>
							<a href='#faq'>
								<Button variant='outline'>FAQ</Button>
							</a>
							<a href='#compare'>
								<Button>
									Compare Plans
									<ArrowRight className='w-4 h-4 ml-2' />
								</Button>
							</a>
						</div>
					</div>
				</div>
				<Plans />
				<CompareTable />
				<FAQ />
			</div>
		</main>
	);
}
