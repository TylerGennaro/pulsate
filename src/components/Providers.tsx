'use client';

import { ThemeProviderProps } from 'next-themes/dist/types';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { TooltipProvider } from './ui/tooltip';

export default function Providers({ children, ...props }: ThemeProviderProps) {
	return (
		<SessionProvider>
			<NextThemesProvider attribute='class' defaultTheme='system' enableSystem>
				<TooltipProvider delayDuration={0}>{children}</TooltipProvider>
			</NextThemesProvider>
		</SessionProvider>
	);
}
