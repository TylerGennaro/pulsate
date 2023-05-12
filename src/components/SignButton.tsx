'use client';

import { Button } from './ui/button';
import { signIn, signOut } from 'next-auth/react';
import { DropdownMenuItem } from './ui/dropdown-menu';
import { LogOut } from 'lucide-react';

export function SignInButton() {
	return <Button onClick={() => signIn('google')}>Sign In</Button>;
}

export function SignOutButton() {
	return <Button onClick={() => signOut()}>Sign Out</Button>;
}

export function DropdownSignOutButton() {
	return (
		<DropdownMenuItem className='text-red-500' onClick={() => signOut()}>
			<LogOut className='w-4 h-4 mr-2' />
			Sign Out
		</DropdownMenuItem>
	);
}
