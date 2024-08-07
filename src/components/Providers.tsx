'use client';

import { ThemeProviderProps } from 'next-themes/dist/types';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { TooltipProvider } from './ui/tooltip';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { Provider as BalancerProvider } from 'react-wrap-balancer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './ui/toaster';

const queryClient = new QueryClient();

export default function Providers({
	children,
	session,
}: ThemeProviderProps & { session: Session | null }) {
	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider session={session}>
				<NextThemesProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
				>
					<TooltipProvider delayDuration={0}>
						<Toaster />
						<BalancerProvider>{children}</BalancerProvider>
					</TooltipProvider>
				</NextThemesProvider>
			</SessionProvider>
		</QueryClientProvider>
	);
}
