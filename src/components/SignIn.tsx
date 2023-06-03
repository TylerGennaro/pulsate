'use client';

import { signIn } from 'next-auth/react';
import Header from './ui/Header';

export default function SignIn() {
	return (
		<div className='w-full h-full grid place-items-center'>
			<div className='text-center flex flex-col gap-4'>
				<div>
					<Header size='md'>Sign In to continue</Header>
					<span className='text-muted-foreground'>
						Continue by signing in with Google
					</span>
				</div>
				<button
					className='flex items-center bg-primary text-primary-foreground'
					onClick={() => signIn('google')}
				>
					<img
						src='/google.svg'
						alt='G'
						className='w-10 h-10 bg-white m-[1px]'
					/>
					<span className='px-4 font-semibold'>Sign in with Google</span>
				</button>
			</div>
		</div>
	);
}
