import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Skeleton } from '@components/ui/skeleton';
import { authOptions } from '@lib/auth';
import { db } from '@lib/prisma';
import { ShareStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';

async function getSharedUsers(locationId: string) {
	const session = await getServerSession(authOptions);
	const users = await db.locationShare.findMany({
		where: {
			locationId,
		},
		include: {
			user: {
				select: {
					name: true,
					email: true,
					image: true,
				},
			},
		},
	});
	if (session?.user)
		users.push({
			id: 0,
			locationId,
			userId: session.user.id,
			status: ShareStatus.ACCEPTED,
			lastUpdated: new Date(),
			user: {
				name: (session.user.name ?? null) + ' (You)',
				email: session.user.email ?? null,
				image: session.user.image ?? null,
			},
		});
	return users;
}

type SharedUserListProps = {
	locationId: string;
};

export default async function SharedUserList({
	locationId,
}: SharedUserListProps) {
	const users = await getSharedUsers(locationId);
	const usersByStatus = users.reduce<Record<string, typeof users>>(
		(acc, curr) => {
			if (!acc[curr.status]) acc[curr.status] = [];
			acc[curr.status].push(curr);
			return acc;
		},
		{}
	);

	return (
		<>
			<ul className='flex flex-col gap-8'>
				{usersByStatus[ShareStatus.ACCEPTED]?.map((user) => (
					<SharedUser key={user.id} user={user} />
				))}
			</ul>
			<div className='my-8 w-fit'>
				<p className='font-medium text-muted-foreground'>Pending requests</p>
				<hr className='mt-2' />
			</div>
			<ul className='flex flex-col gap-6'>
				{usersByStatus[ShareStatus.PENDING]?.map((user) => (
					<SharedUser key={user.id} user={user} />
				))}
			</ul>
		</>
	);
}

function SharedUser({
	user,
}: {
	user: Awaited<ReturnType<typeof getSharedUsers>>[0];
}) {
	return (
		<li className='flex items-center gap-4'>
			<Avatar>
				<AvatarImage
					src={user.user.image || undefined}
					className='object-cover w-12 h-12 rounded-full'
				/>
				<AvatarFallback>
					<Skeleton className='w-12 h-12 rounded-full' />
				</AvatarFallback>
			</Avatar>
			<div className='flex flex-col gap-1'>
				<span className='font-medium'>{user.user.name}</span>
				<span className='text-sm text-muted-foreground'>{user.user.email}</span>
			</div>
		</li>
	);
}

export function SharedUserListSkeleton() {
	return (
		<ul className='flex flex-col gap-4'>
			{Array.from({ length: 2 }).map((_, i) => (
				<li key={i} className='flex items-center gap-4'>
					<Skeleton className='w-12 h-12 rounded-full' />
					<div className='flex flex-col gap-1'>
						<Skeleton className='h-6 w-36' />
						<Skeleton className='w-48 h-4' />
					</div>
				</li>
			))}
		</ul>
	);
}
