import { SignInButton } from '@components/SignButton';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24'>
			<Link
				href='/inventory'
				className='flex items-center bg-foreground py-2 px-4 rounded shadow-md'
			>
				Inventory
				<ChevronRight className='w-4 h-4 ml-2' />
			</Link>
			<SignInButton />
		</main>
	);
}
