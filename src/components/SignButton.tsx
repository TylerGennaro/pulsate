'use client';

import { Button, ButtonProps } from './ui/button';
import { signIn, signOut } from 'next-auth/react';
import { DropdownMenuItem } from './ui/dropdown-menu';
import { LogOut } from 'lucide-react';

export function SignInButton({
	redirect = true,
	className,
	children,
	...props
}: ButtonProps & { redirect?: boolean; className?: string }) {
	return (
		<Button className={className} onClick={() => signIn()} {...props}>
			{children || 'Sign In'}
		</Button>
	);
}

export function SignOutButton({ redirect = true }: { redirect?: boolean }) {
	return (
		<Button
			variant='outline'
			onClick={() =>
				signOut({
					redirect,
				})
			}
		>
			Sign Out
		</Button>
	);
}

export function DropdownSignOutButton() {
	return (
		<DropdownMenuItem className='text-red-500' onClick={() => signOut()}>
			<LogOut className='w-4 h-4 mr-2' />
			Sign Out
		</DropdownMenuItem>
	);
}
