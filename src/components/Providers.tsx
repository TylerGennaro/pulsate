'use client';

import { ThemeProviderProps } from 'next-themes/dist/types';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { TooltipProvider } from './ui/tooltip';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

export default function Providers({
	children,
	session,
}: ThemeProviderProps & { session: Session | null }) {
	return (
		<SessionProvider session={session}>
			<NextThemesProvider attribute='class' defaultTheme='system' enableSystem>
				<TooltipProvider delayDuration={0}>{children}</TooltipProvider>
			</NextThemesProvider>
		</SessionProvider>
	);
}
