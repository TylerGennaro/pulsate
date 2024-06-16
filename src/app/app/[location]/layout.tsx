import SignIn from '@components/SignIn';
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
	return <>{children}</>;
}
