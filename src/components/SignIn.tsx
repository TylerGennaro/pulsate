'use client';

import { signIn } from 'next-auth/react';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa';

import { useSearchParams } from 'next/navigation';
import { IconType } from 'react-icons';
import Logo from './Logo';
import { ThemeToggle } from './ThemeToggle';
import Heading from './ui/heading';

interface ProviderProps {
	name: string;
	icon: IconType;
	color: string;
	provider: string;
	callbackUrl?: string;
}

function Provider({
	name,
	icon: Icon,
	color,
	provider,
	callbackUrl,
}: ProviderProps) {
	return (
		<button
			className={`flex items-center justify-center ${color} text-zinc-50 p-2 rounded-md hover:brightness-110 transition-all`}
			onClick={() =>
				signIn(provider, {
					callbackUrl,
				})
			}
		>
			<Icon size={24} />
			<span className='px-4 font-semibold'>{name}</span>
		</button>
	);
}

export default function SignIn() {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl') ?? undefined;
	return (
		<div className='grid w-screen h-screen place-items-center'>
			<div className="absolute top-0 left-0 w-screen h-screen bg-[url('/dot_grid_light.svg')] dark:bg-[url('/dot_grid.svg')] -z-[1]" />
			<div className='flex flex-col w-full max-w-sm gap-4 p-8 border rounded-md shadow-md bg-content'>
				<div className='flex items-center justify-between mb-4'>
					<Logo />
					<ThemeToggle />
				</div>
				<Heading
					header='Sign In'
					description='Choose a provider to sign in with'
				/>
				<hr />
				<Provider
					name='Google'
					provider='google'
					callbackUrl={callbackUrl}
					icon={FaGoogle}
					color='bg-blue-600'
				/>
				<Provider
					name='Microsoft'
					provider='azure-ad'
					callbackUrl={callbackUrl}
					icon={FaMicrosoft}
					color='bg-emerald-700'
				/>
			</div>
		</div>
	);
}
