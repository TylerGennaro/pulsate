'use client';

import { signIn } from 'next-auth/react';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa';

import { IconType } from 'react-icons';
import Heading from './ui/heading';
import Image from 'next/image';

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
			className={`flex items-center justify-center ${color} text-primary-foreground p-2 rounded-md hover:brightness-110 transition-all`}
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

export default function SignIn({ callbackUrl }: { callbackUrl?: string }) {
	return (
		<div className='w-screen h-screen grid place-items-center'>
			<div className='max-w-sm w-full flex flex-col gap-4 bg-foreground p-8 rounded-md shadow-md'>
				<div className='flex items-center mb-4'>
					<Image src='/logo.svg' alt='logo' width={64} height={64} />
					<span className='text-2xl font-semibold'>Pulsate</span>
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
					color='bg-gray-900'
				/>
			</div>
		</div>
	);
}
