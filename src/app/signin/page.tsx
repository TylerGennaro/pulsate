import SignIn from '@components/SignIn';
import { populateMetadata } from '@lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Sign In',
	description: 'Sign in to Pulsate',
};

export default function Page() {
	return <SignIn />;
}
