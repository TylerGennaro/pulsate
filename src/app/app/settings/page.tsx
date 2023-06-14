import { getServerSession } from 'next-auth';
import { Metadata } from 'next';
import SignIn from '@components/SignIn';
import { authOptions } from '@lib/auth';

export const metadata: Metadata = {
	title: 'Settings | LFHRS Inventory',
	description: 'Manage medical supply inventory for LFHRS.',
};

export default async function Page() {
	const session = await getServerSession(authOptions);
	if (!session) return <SignIn />;

	return (
		<div className='w-full h-full grid place-items-center'>
			<div className='bg-foreground border p-8 rounded'>
				<span className='text-lg'>Page under development</span>
			</div>
		</div>
	);
}
