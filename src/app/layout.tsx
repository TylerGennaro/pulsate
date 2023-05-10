import SiteHeader from '@components/SiteHeader';
import ThemeProvider from '@components/ThemeProvider';
import '@styles/globals.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';

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
			<body className={inter.className}>
				<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
					<SiteHeader />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
