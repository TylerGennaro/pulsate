'use client';

import { ThemeProviderProps } from 'next-themes/dist/types';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { TooltipProvider } from './ui/tooltip';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { Provider as BalancerProvider } from 'react-wrap-balancer';

export default function Providers({
	children,
	session,
}: ThemeProviderProps & { session: Session | null }) {
	return (
		<SessionProvider session={session}>
			<NextThemesProvider attribute='class' defaultTheme='system' enableSystem>
				<TooltipProvider delayDuration={0}>
					<BalancerProvider>{children}</BalancerProvider>
				</TooltipProvider>
			</NextThemesProvider>
		</SessionProvider>
	);
}
