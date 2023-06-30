import { getServerSession } from 'next-auth';
import { Metadata } from 'next';
import SignIn from '@components/SignIn';
import { authOptions } from '@lib/auth';
import Container from '@components/Container';
import Nav from './Nav';

export const metadata: Metadata = {
	title: 'Settings | LFHRS Inventory',
	description: 'Manage medical supply inventory for LFHRS.',
};

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);
	if (!session) return <SignIn />;

	return (
		<Container className='p-0'>
			<Nav />
			<div>{children}</div>
		</Container>
	);
}
