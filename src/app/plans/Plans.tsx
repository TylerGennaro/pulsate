import PlanCard from './PlanCard';

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
};

export default function Plans() {
	return (
		<div id='plans' className='flex flex-wrap justify-center gap-2'>
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
	);
}
