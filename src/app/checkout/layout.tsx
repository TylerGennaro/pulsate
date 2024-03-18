import Logo from '@components/Logo';
import SiteHeader from '@components/SiteHeader';
import { Home } from 'lucide-react';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex flex-col h-screen'>
			<SiteHeader
				showDashboard
				className='absolute top-0 left-0 right-0 shadow-sm'
			>
				<Logo />
			</SiteHeader>
			<div className='flex justify-center h-full mt-16 overflow-auto'>
				{children}
			</div>
		</div>
	);
}
