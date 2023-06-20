import Header from '@components/ui/header';

function FAQEntry({ question, answer }: { question: string; answer: string }) {
	return (
		<div className='flex flex-col gap-2 py-8 border-b last-of-type:border-none'>
			<span className='font-semibold'>{question}</span>
			<span className='text-sm text-muted'>{answer}</span>
		</div>
	);
}

export default function FAQ() {
	return (
		<div id='faq'>
			<Header>Frequently Asked Questions</Header>
			<ul className='flex flex-col'>
				<FAQEntry
					question='Why the one-time fee?'
					answer='The one-time fee helps us invest early into better infrastructure, ultimately providing you with a better user experience.'
				/>
				<FAQEntry
					question='Why have a monthly payment and a one-time fee?'
					answer="Resources aren't cheap. All reliable cloud-hosted databases require a monthly payment. The one-time fee helps us invest back into the application, while the monthly payment helps keep the doors open over time."
				/>
				<FAQEntry
					question='Why are the number of locations, products, etc. limited?'
					answer='As previously stated, cloud-hosted databases are expensive. Payments are calculated based on the amount of storage you use and the computing power you require. The more data you use, the higher the database bill. Thus, the number of resources you can use is limited to ensure your usage never exceeds the bill cost.'
				/>
				<FAQEntry
					question='Will I get charged another one-time fee if I upgrade from a lower plan to a higher plan?'
					answer='No. You will only be charged the difference in monthly payments.'
				/>
			</ul>
		</div>
	);
}
