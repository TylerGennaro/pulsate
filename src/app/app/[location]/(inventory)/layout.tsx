import Container from '@components/Container';
import LocationHeader from '@components/location/LocationHeader';
import SignIn from '@components/SignIn';
import {
	LinkTabPanel,
	LinkTabs,
	LinkTabTrigger,
} from '@components/ui/link-tabs';
import { authOptions } from '@lib/auth';
import { fetchLocationInfo } from '@lib/data';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

export default async function Layout({
	children,
	params,
}: {
	children: ReactNode;
	params: { location: string };
}) {
	const session = await getServerSession(authOptions);
	if (!session) return <SignIn />;
	const { name, userId } = await fetchLocationInfo(params.location);
	if (!name) return notFound();
	if (userId !== session.user.id) return notFound();
	return (
		<>
			<LocationHeader location={params.location} />
			<Container>
				<LinkTabs>
					<LinkTabTrigger href={`/app/${params.location}`}>
						Products
					</LinkTabTrigger>
					<LinkTabTrigger href={`/app/${params.location}/activity`}>
						Activity
					</LinkTabTrigger>
					<LinkTabTrigger href={`/app/${params.location}/settings`}>
						Settings
					</LinkTabTrigger>
				</LinkTabs>
				<LinkTabPanel>{children}</LinkTabPanel>
				{/* <Tabs value='activity'>
					<TabsList>
						<Link href={`/app/${params.location}`}>
							<TabsTrigger value='products'>Products</TabsTrigger>
						</Link>
						<Link href={`/app/${params.location}/activity`}>
							<TabsTrigger value='activity'>Activity</TabsTrigger>
						</Link>
						<Link href={`/app/${params.location}/settings`}>
							<TabsTrigger value='settings'>Settings</TabsTrigger>
						</Link>
					</TabsList>
				</Tabs>
				<div className='mt-8'>{children}</div> */}
			</Container>
		</>
	);
}
