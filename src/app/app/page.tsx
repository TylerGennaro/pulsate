import { getServerSession } from 'next-auth';
import { Metadata } from 'next';
import SignIn from '@components/SignIn';
import { authOptions } from '@lib/auth';
import Container from '@components/Container';
import Heading from '@components/ui/heading';
import { populateMetadata } from '@lib/utils';

export const metadata = populateMetadata('Dashboard');

export default async function Page() {
	const session = await getServerSession(authOptions);
	if (!session) return <SignIn />;

	return (
		<Container>
			<Heading header='Dashboard' description='Under development' />
		</Container>
	);
}
