import { getServerSession } from 'next-auth';
import SignIn from '@components/SignIn';
import { authOptions } from '@lib/auth';
import { populateMetadata } from '@lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';

export const metadata = populateMetadata('Account Settings');

export default async function Page() {
	const session = await getServerSession(authOptions);
	if (!session) return <SignIn />;

	return (
		<div>
			<Tabs defaultValue='account'>
				<TabsList>
					<TabsTrigger value='account'>Account</TabsTrigger>
					<TabsTrigger value='billing'>Billing</TabsTrigger>
				</TabsList>
				<TabsContent value='account'>Account settings</TabsContent>
				<TabsContent value='billing'>Billing settings</TabsContent>
			</Tabs>
		</div>
	);
}
