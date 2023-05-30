'use client';

import { ThemeProviderProps } from 'next-themes/dist/types';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { TooltipProvider } from './ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const queryClient = new QueryClient();

export default function Providers({ children, ...props }: ThemeProviderProps) {
	return (
		<SessionProvider>
			<QueryClientProvider client={queryClient}>
				<NextThemesProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
				>
					<TooltipProvider delayDuration={0}>{children}</TooltipProvider>
				</NextThemesProvider>
			</QueryClientProvider>
		</SessionProvider>
	);
}
