import { fetchLocationInfo } from '@lib/data';
import { populateMetadata } from '@lib/utils';
import { ReactNode } from 'react';

export async function generateMetadata({
	params,
}: {
	params: { location: string };
}) {
	const { name } = await fetchLocationInfo(params.location);
	return populateMetadata(name ?? 'Unknown Location');
}

export default function Layout({
	children,
}: {
	tabs: ReactNode;
	children: ReactNode;
}) {
	return <>{children}</>;
}
