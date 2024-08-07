import Providers from '@components/Providers';
import '@styles/globals.css';
import { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/auth';
import { cn } from '@lib/utils';

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
		<html lang='en'>
			<body className={cn(roboto.className)}>
				<Providers session={session}>{children}</Providers>
			</body>
		</html>
	);
}
