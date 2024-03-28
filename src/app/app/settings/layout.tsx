import { getServerSession } from 'next-auth';
import { Metadata } from 'next';
import SignIn from '@components/SignIn';
import { authOptions } from '@lib/auth';
import Container from '@components/Container';
import Nav from './Nav';
import { populateMetadata } from '@lib/utils';

export const metadata = populateMetadata('Settings');

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);
	if (!session) return <SignIn />;

	return <Container className='p-0'>{children}</Container>;
}
