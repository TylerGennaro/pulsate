'use client';

import { signIn } from 'next-auth/react';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa';

import { IconType } from 'react-icons';
import Heading from './ui/heading';
import Image from 'next/image';
import Logo from './Logo';
import { useSearchParams } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

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
			<div className='flex flex-col w-full max-w-sm gap-4 p-8 border rounded-md shadow-md bg-zinc-50 dark:bg-zinc-900'>
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
