import HeroHeading from '@components/HeroHeading';
import Header from '@components/ui/header';
import { DollarSign, Pointer, UploadCloud, UserCog } from 'lucide-react';

const features = [
	{
		title: 'Instant deployment',
		icon: UploadCloud,
		description:
			'Get started in minutes. No need to wait for a long deployment process.',
	},
	{
		title: 'Easy setup',
		icon: UserCog,
		description:
			'Setup your account and inventory in minutes. Start organizing in just a few clicks.',
	},
	{
		title: 'Intuitive interface',
		icon: Pointer,
		description:
			"The interface is designed to be intuitive and easy to use. You don't need to spend hours learning how to use the service.",
	},
	{
		title: 'Transparent pricing',
		icon: DollarSign,
		description:
			'We believe in transparent pricing. You will always know what you are paying for.',
	},
];

export default function Features() {
	return (
		<div
			id='features'
			className='flex flex-col items-center w-full gap-16 px-8 py-16 bg-zinc-100 dark:bg-zinc-900 border-y'
		>
			<HeroHeading
				title='We have what you need'
				description='We develop the service with you in mind. Features are maintained to
					ensure you spend less time worrying and more time focusing on what matters.'
			/>
			<div className='grid max-w-screen-md grid-cols-1 gap-16 sm:grid-cols-2'>
				{features.map((feature) => (
					<div className='flex gap-4' key={feature.title}>
						<div className='p-2 bg-blue-700 rounded-lg text-zinc-50 h-fit'>
							<feature.icon className='w-6 h-6' />
						</div>
						<div className='flex flex-col items-start'>
							<span className='text-lg font-semibold'>{feature.title}</span>
							<span className='text-muted'>{feature.description}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
