import Header from '@components/ui/header';
import PlanCard from './PlanCard';
import { Button } from '@components/ui/button';
import { ArrowRight } from 'lucide-react';
import FAQ from './FAQ';
import CompareTable from './CompareTable';

const plans = {
	Free: {
		price: 0,
		monthly: 0,
		perks: {
			'Inventory management': true,
			'Expiration date tracking': true,
			'Multiple locations': false,
			'Activity log': false,
			'Printable QR Codes': false,
			'Inventory notifications': false,
			'Location sharing': false,
		},
	},
	Manager: {
		price: 299,
		monthly: 15,
		perks: {
			'Inventory management': true,
			'Expiration date tracking': true,
			'Multiple locations': true,
			'Activity log': true,
			'Printable QR Codes': true,
			'Inventory notifications': true,
			'Location sharing': false,
		},
	},
	Executive: {
		price: 299,
		monthly: 40,
		best: true,
		perks: {
			'Inventory management': true,
			'Expiration date tracking': true,
			'Multiple locations': true,
			'Activity log': true,
			'Printable QR Codes': true,
			'Inventory notifications': true,
			'Location sharing': true,
		},
	},
};

export default function Page() {
	return (
		<div className='h-[100dvh] flex flex-col gap-32 p-16 overflow-auto'>
			<div className='flex justify-center w-full'>
				<div className='flex flex-col items-center max-w-screen-md gap-2'>
					<Header size='xl' className='text-center'>
						Plans suited for your needs
					</Header>
					<span className='w-3/4 text-center text-muted'>
						Choose the best plan for your orgnization and don't overpay. Plans
						are differentiated by scale and features.
					</span>
					<div className='flex gap-2 mt-2'>
						<Button variant='outline'>FAQ</Button>
						<Button>
							Compare Plans
							<ArrowRight className='w-4 h-4 ml-2' />
						</Button>
					</div>
				</div>
			</div>
			<div className='flex flex-wrap justify-center gap-8'>
				{Object.entries(plans).map(([name, { monthly, price, perks }]) => (
					<PlanCard
						key={name}
						name={name}
						monthly={monthly}
						price={price}
						perks={perks}
					/>
				))}
			</div>
			<CompareTable />
			<FAQ />
		</div>
	);
}
