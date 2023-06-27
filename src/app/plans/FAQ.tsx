import Header from '@components/ui/header';
import { ExternalLink } from 'lucide-react';

function FAQEntry({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex flex-col gap-2 py-8 border-b last-of-type:border-none'>
			{children}
		</div>
	);
}

function FAQQestion({ children }: { children: React.ReactNode }) {
	return <span className='font-semibold'>{children}</span>;
}

function FAQAnswer({ children }: { children: React.ReactNode }) {
	return <span className='text-sm text-muted'>{children}</span>;
}

export default function FAQ() {
	return (
		<div id='faq'>
			<Header>Frequently Asked Questions</Header>
			<ul className='flex flex-col'>
				<FAQEntry>
					<FAQQestion>Why the one-time fee?</FAQQestion>
					<FAQAnswer>
						The one-time fee helps us invest early into better infrastructure,
						ultimately providing you with a better user experience.
					</FAQAnswer>
				</FAQEntry>
				<FAQEntry>
					<FAQQestion>
						Why have a monthly payment and a one-time fee?
					</FAQQestion>
					<FAQAnswer>
						Resources aren&apos;t cheap. All reliable cloud-hosted databases
						require a monthly payment. The one-time fee helps us invest back
						into the application, while the monthly payment helps keep the doors
						open over time.
					</FAQAnswer>
				</FAQEntry>
				<FAQEntry>
					<FAQQestion>
						Why are the number of locations, products, etc. limited?
					</FAQQestion>
					<FAQAnswer>
						As previously stated, cloud-hosted databases are expensive. Payments
						are calculated based on the amount of storage you use and the
						computing power you require. The more data you use, the higher the
						database bill. Thus, the number of resources you can use is limited
						to ensure your usage never exceeds the bill cost.
					</FAQAnswer>
				</FAQEntry>
				<FAQEntry>
					<FAQQestion>
						Will I get charged another one-time fee if I upgrade from a lower
						plan to a higher plan?
					</FAQQestion>
					<FAQAnswer>
						No. You will only be charged the difference in monthly payments.
					</FAQAnswer>
				</FAQEntry>
				<FAQEntry>
					<FAQQestion>
						Will my payment information be saved and sold?
					</FAQQestion>
					<FAQAnswer>
						No. We use{' '}
						<a
							className='inline-flex font-medium text-zinc-950 dark:text-zinc-50'
							href='https://stripe.com'
							target='_blank'
						>
							Stripe
							<ExternalLink className='w-2 h-2' />
						</a>{' '}
						to handle all payments. Your information is solely processed by
						Stripe and never sent to us. Therefore, we never have access to any
						of your payment details.
					</FAQAnswer>
				</FAQEntry>
			</ul>
		</div>
	);
}
