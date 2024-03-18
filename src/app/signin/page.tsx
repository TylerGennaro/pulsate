import SignIn from '@components/SignIn';
import { populateMetadata } from '@lib/utils';

export const metadata = populateMetadata('Sign In');

export default function Page() {
	return <SignIn />;
}
