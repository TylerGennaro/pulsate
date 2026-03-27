import { SearchProvider } from '@components/SearchProvider';
import { PermissionsProvider } from '@context/permissionsContext';
import { authOptions } from '@lib/auth';
import { fetchLocationInfo } from '@lib/data';
import { getPermissions } from '@lib/permissions';
import { populateMetadata } from '@lib/utils';
import { getServerSession } from 'next-auth';
import { ReactNode } from 'react';

export async function generateMetadata(props: {
	params: Promise<{ location: string }>;
}) {
	const params = await props.params;
	const { name } = await fetchLocationInfo(params.location);
	return populateMetadata(name ?? 'Unknown Location');
}

type LayoutProps = {
	children: ReactNode;
	params: Promise<{ location: string }>;
};

export default async function Layout(props: LayoutProps) {
	const params = await props.params;

	const { children } = props;

	const session = await getServerSession(authOptions);
	const permissions = session
		? await getPermissions(session.user, params.location)
		: new Set<Permission>();
	return (
		<PermissionsProvider permissions={permissions}>
			<SearchProvider>{children}</SearchProvider>
		</PermissionsProvider>
	);
}
