import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { Awaitable, NextAuthOptions } from 'next-auth';
import { db } from './prisma';
import GoogleProvider from 'next-auth/providers/google';
import AzureADProvider from 'next-auth/providers/azure-ad';
import { getTier } from './stripe-util';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { nanoid } from 'nanoid';
import { USER_ID_LENGTH } from './constants';
import { AdapterAccount, AdapterUser } from 'next-auth/adapters';

function getGoogleCredentials(): { clientId: string; clientSecret: string } {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
	if (!clientId || !clientSecret) {
		throw new Error('Missing Google Client ID or Client Secret');
	}
	return { clientId, clientSecret };
}

function getAzureCredentials() {
	const clientId = process.env.AZURE_AD_CLIENT_ID;
	const clientSecret = process.env.AZURE_AD_CLIENT_SECRET;
	const tenantId = process.env.AZURE_AD_TENANT_ID;
	if (!clientId || !clientSecret || !tenantId) {
		throw new Error('Missing Azure AD Client ID, Client Secret, or Tenant ID');
	}
	return { clientId, clientSecret, tenantId };
}

function CustomPrismaAdapter(
	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
) {
	return {
		...PrismaAdapter(db),
		createUser: (data: Omit<AdapterUser, 'id'>) =>
			db.user.create({
				data: { ...data, id: nanoid(USER_ID_LENGTH) },
			}) as Promise<AdapterUser>,
		linkAccount: async (account: AdapterAccount) => {
			await db.account.create({ data: account });
		},
	};
}

export const authOptions: NextAuthOptions = {
	adapter: CustomPrismaAdapter(db),
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/signin',
	},
	providers: [
		GoogleProvider({
			clientId: getGoogleCredentials().clientId,
			clientSecret: getGoogleCredentials().clientSecret,
		}),
		AzureADProvider({
			clientId: getAzureCredentials().clientId,
			clientSecret: getAzureCredentials().clientSecret,
			tenantId: getAzureCredentials().tenantId,
		}),
	],
	callbacks: {
		async session({ token, session }) {
			const tier = await getTier(token.id);
			if (token && session?.user) {
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.image = token.picture;
				session.user.tier = tier;
			}

			return session;
		},
		async jwt({ token, user }) {
			const dbUser = await db.user.findFirst({
				where: {
					email: token.email,
				},
			});

			if (!dbUser) {
				token.id = user!.id;
				return token;
			}

			return {
				id: dbUser.id,
				name: dbUser.name,
				email: dbUser.email,
				picture: dbUser.image,
			};
		},
		redirect({ url, baseUrl }) {
			return url.startsWith(baseUrl) ? url : baseUrl;
		},
	},
};
