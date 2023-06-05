import Sidebar from '@components/Sidebar';
import '@styles/globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Dashboard | LFHRS Inventory',
	description: 'Manage medical supply inventory for LFHRS.',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='flex h-screen'>
			{/* @ts-expect-error */}
			<Sidebar />
			<div className='w-full h-full overflow-y-scroll p-8'>{children}</div>
		</div>
	);
}
