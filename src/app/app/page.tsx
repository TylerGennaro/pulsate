import Container from '@components/Container';
import SignIn from '@components/SignIn';
import Heading from '@components/ui/heading';
import { authOptions } from '@lib/auth';
import { populateMetadata } from '@lib/utils';
import { getServerSession } from 'next-auth';
import CheckoutHistory from './(modules)/CheckoutHistory';
import PopularItems from './(modules)/PopularItems';
import StockAlerts from './(modules)/StockAlerts';

export const metadata = populateMetadata('Dashboard');

export default async function Page() {
	const session = await getServerSession(authOptions);
	if (!session) return <SignIn />;

	return (
		<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
			{/* <Container>
				<Heading header='Dashboard' description='Under development' />
			</Container> */}
			<Container>
				<Heading
					header='Checkout History'
					description='Checkout history by location'
				/>
				<CheckoutHistory />
			</Container>
			<Container>
				<Heading
					header='Popular Items'
					description='Items with the most checkouts in the last week'
				/>
				<PopularItems />
			</Container>
			<Container>
				<Heading
					header='Stock Alerts'
					description='Inventories with low or expiring stock'
				/>
				<StockAlerts />
			</Container>
			<Container className='h-fit'>
				<Heading
					header='Users'
					description='Users who have checked out items'
				/>
			</Container>
		</div>
	);
}
