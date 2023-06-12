'use client';

import SignIn from '@components/SignIn';
import { useSearchParams } from 'next/navigation';

export default function Page() {
	const searchParams = useSearchParams();
	return <SignIn callbackUrl={searchParams.get('callbackUrl') ?? undefined} />;
}
