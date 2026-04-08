import Providers from '@components/Providers';
import { authOptions } from '@lib/auth';
import { cn } from '@lib/utils';
import '@styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
	weight: ['100', '300', '400', '500', '700', '900'],
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
		<html lang='en' suppressHydrationWarning>
			<body className={cn(roboto.className)}>
				<Providers session={session}>{children}</Providers>
				<Analytics />
			</body>
		</html>
	);
}
