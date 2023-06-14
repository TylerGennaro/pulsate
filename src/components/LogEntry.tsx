import { Log, Product, User } from '@prisma/client';
import { Badge } from './ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { templates } from '@lib/logTemplates';
import { timeSince } from '@lib/date';
import Link from 'next/link';
import { VariantProps } from 'class-variance-authority';

function InlineBadge({
	children,
	color,
}: {
	children: React.ReactNode;
	color?: VariantProps<typeof Badge>['color'];
}) {
	return (
		<Badge variant='ghost' color={color} className='mx-1'>
			{children}
		</Badge>
	);
}

function UserPopover({ user }: { user: User | null }) {
	if (!user) return <span>Unknown User</span>;
	return (
		<HoverCard openDelay={0} closeDelay={0}>
			<HoverCardTrigger asChild>
				<InlineBadge color='gray'>{user.name}</InlineBadge>
			</HoverCardTrigger>
			<HoverCardContent>
				<div className='flex items-center gap-4'>
					<Avatar>
						<AvatarImage src={user.image || undefined} />
						<AvatarFallback>
							{user.name?.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className='flex flex-col gap-2'>
						<span>{user.name}</span>
						<span className='text-sm text-muted-text'>{user.email}</span>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}

export default function LogEntry({
	log,
	last,
	noLink = false,
}: {
	log: Log & { user: User | null; product: Product | null };
	last: boolean;
	noLink?: boolean;
}) {
	// await new Promise((resolve) => setTimeout(resolve, 4000));
	const template = templates[log.type];
	if (!template) return null;

	return (
		<div className='flex gap-2'>
			<div className='relative'>
				<div className='z-[1] relative rounded-full border-8 border-zinc-50 dark:border-zinc-900'>
					<Avatar>
						<AvatarImage src={log.user?.image || undefined} />
						<AvatarFallback>
							{log.user?.name?.charAt(0).toUpperCase() || 'G'}
						</AvatarFallback>
					</Avatar>
					<div className='w-1/2 h-1/2 absolute bottom-0 right-0 bg-zinc-50 dark:bg-zinc-900 z-[2] grid place-items-center rounded-tl'>
						<template.icon className='w-4 h-4 text-muted-text' />
					</div>
				</div>
				{!last && (
					<div className='absolute w-[1px] left-1/2 top-2 bg-zinc-300 dark:bg-zinc-700 h-full' />
				)}
			</div>
			<div className='flex flex-col'>
				<span className='mb-1 font-semibold'>
					{log.user?.name || 'Guest'}
					<span className='ml-4 text-sm font-normal text-muted'>
						{timeSince(log.timestamp)} ago
					</span>
				</span>
				<div className={log.footnote === null ? 'mb-8' : 'mb-2'}>
					<Badge
						variant='ghost'
						color={template.badge.color as VariantProps<typeof Badge>['color']}
					>
						{template.badge.text}
					</Badge>
					{log.product !== null && (
						<span className='ml-2 text-zinc-600 dark:text-zinc-400'>
							{template.quantity && <span>{log.quantity} </span>}
							{noLink ? (
								<span>{log.product?.name}</span>
							) : (
								<Link href={`/app/${log.product?.locationId}/${log.productId}`}>
									{log.product?.name}
								</Link>
							)}
						</span>
					)}
				</div>
				{log.footnote && (
					<span className='flex items-center mb-8 text-sm'>{log.footnote}</span>
				)}
			</div>
		</div>
	);
}
