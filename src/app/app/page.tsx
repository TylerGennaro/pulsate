import Container from '@components/Container';
import SignIn from '@components/SignIn';
import { authOptions } from '@lib/auth';
import { populateMetadata } from '@lib/utils';
import { AlertTriangle } from 'lucide-react';
import { getServerSession } from 'next-auth';
import DashboardModules from './DashboardModules';

export const metadata = populateMetadata('Dashboard');

export default async function Page() {
	const session = await getServerSession(authOptions);
	if (!session) return <SignIn />;

	return (
		<div className='grid grid-cols-1 gap-8 p-6 xl:grid-cols-2'>
			<DashboardModules />
		</div>
	);
}
