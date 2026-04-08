'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Provider as BalancerProvider } from 'react-wrap-balancer';
import { Toaster } from './ui/toaster';
import { TooltipProvider } from './ui/tooltip';

const queryClient = new QueryClient();

export default function Providers({
	children,
	session,
}: {
	session: Session | null;
	children: React.ReactNode;
}) {
	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider session={session}>
				<NextThemesProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
				>
					<TooltipProvider delayDuration={0}>
						<BalancerProvider>{children}</BalancerProvider>
						<Toaster />
					</TooltipProvider>
				</NextThemesProvider>
			</SessionProvider>
		</QueryClientProvider>
	);
}
