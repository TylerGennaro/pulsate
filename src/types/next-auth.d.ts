/* eslint-disable no-unused-vars */

import type { Profile, Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

type UserId = string;

declare module 'next-auth/jwt' {
	interface JWT {
		id: UserId;
	}
}

declare module 'next-auth' {
	interface Session {
		user: User & {
			id: UserId;
			name: string | null | undefined;
			email: string | null | undefined;
			image: string | null | undefined;
			tier: string | null | undefined;
		};
	}
}
