import Providers from '@components/Providers';
import '@styles/globals.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { cn } from '@lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Home | LFHRS Inventory',
	description: 'Manage medical supply inventory for LFHRS.',
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);
	return (
		<html lang='en'>
			<body className={inter.className}>
				<Providers session={session}>
					<Toaster position='bottom-right' />
					{children}
				</Providers>
			</body>
		</html>
	);
}
