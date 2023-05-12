'use client';

import { ThemeProviderProps } from 'next-themes/dist/types';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';

export default function Providers({ children, ...props }: ThemeProviderProps) {
	return (
		<SessionProvider>
			<NextThemesProvider attribute='class' defaultTheme='system' enableSystem>
				{children}
			</NextThemesProvider>
		</SessionProvider>
	);
}
