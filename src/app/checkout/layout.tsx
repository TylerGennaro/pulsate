import SiteHeader from '@components/SiteHeader';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className='h-screen flex flex-col'>
			<SiteHeader className='absolute top-0 left-0 right-0 shadow-sm'>
				<Link href='/'>Home</Link>
				<Link href='/inventory'>Inventory</Link>
			</SiteHeader>
			<div className='mt-16 flex justify-center h-full overflow-auto'>
				{children}
			</div>
		</div>
	);
}
