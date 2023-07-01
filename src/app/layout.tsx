import Providers from '@components/Providers';
import '@styles/globals.css';
import { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/auth';
import { cn } from '@lib/utils';

const roboto = Roboto({
	weight: '400',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Pulsate',
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
			<body
				className={
					cn(
						roboto.className,
						'overflow-hidden'
					) /* overflow-hidden is necessary */
				}
			>
				<Providers session={session}>
					<Toaster position='bottom-right' />
					{children}
				</Providers>
			</body>
		</html>
	);
}
