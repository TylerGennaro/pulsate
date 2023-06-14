import { getServerSession } from 'next-auth';
import { Metadata } from 'next';
import SignIn from '@components/SignIn';
import { authOptions } from '@lib/auth';
import Container from '@components/Container';
import Heading from '@components/ui/heading';

export const metadata: Metadata = {
	title: 'Dashboard | LFHRS Inventory',
	description: 'Manage medical supply inventory for LFHRS.',
};

export default async function Page() {
	const session = await getServerSession(authOptions);
	if (!session) return <SignIn />;

	return (
		<Container>
			<Heading header='Dashboard' description='Under development' />
		</Container>
	);
}
