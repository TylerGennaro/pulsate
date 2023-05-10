import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Inventory | LFHRS Inventory',
	description: 'Manage medical supply inventory for LFHRS.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return <div>{children}</div>;
}
