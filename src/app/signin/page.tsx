import SignIn from '@components/SignIn';
import { populateMetadata } from '@lib/utils';
import { Metadata } from 'next';

export const metadata = populateMetadata('Sign In');

export default function Page() {
	return <SignIn />;
}
