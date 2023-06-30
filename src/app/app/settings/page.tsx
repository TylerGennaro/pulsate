import { getServerSession } from 'next-auth';
import SignIn from '@components/SignIn';
import { authOptions } from '@lib/auth';
import { populateMetadata } from '@lib/utils';

export const metadata = populateMetadata('Account Settings');

export default async function Page() {
	const session = await getServerSession(authOptions);
	if (!session) return <SignIn />;

	return <span>Account</span>;
}
