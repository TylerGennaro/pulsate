import SiteHeader from '@components/SiteHeader';
import Providers from '@components/Providers';
import '@styles/globals.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { cn } from '@lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Home | LFHRS Inventory',
	description: 'Manage medical supply inventory for LFHRS.',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={cn(inter.className, 'overflow-hidden')}>
				<Providers>
					<Toaster position='bottom-right' />
					<div className='h-screen flex flex-col'>
						{/* @ts-expect-error */}
						<SiteHeader />
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
