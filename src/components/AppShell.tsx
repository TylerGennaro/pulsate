'use client';

import { useSession } from 'next-auth/react';
import Sidebar from './Sidebar';
import SiteHeader from './SiteHeader';
import { useState } from 'react';

export default function AppShell({ children }: { children: React.ReactNode }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	return (
		<div className='flex h-full'>
			<Sidebar open={sidebarOpen} toggle={setSidebarOpen} />
			<div className='flex flex-col w-full h-full shrink'>
				<SiteHeader sidebarToggle={setSidebarOpen} sidebarOpen={sidebarOpen} />
				<div className='w-full h-full p-2 mx-auto max-w-screen-2xl lg:p-4 bg-background'>
					{children}
				</div>
			</div>
		</div>
	);
}
