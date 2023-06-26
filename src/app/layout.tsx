import Providers from '@components/Providers';
import '@styles/globals.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { cn, populateMetadata } from '@lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: {
		template: '%s | Pulsate',
		default: 'Pulsate',
	},
	description:
		'Pulsate is a social media platform for developers to share their projects and ideas.',
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
