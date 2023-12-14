'use client';

import { Bell } from 'lucide-react';
import { Button } from '@ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover';
import { timeSince } from '@lib/date';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Loader from '@ui/loader';
import { fetchJSON } from '@lib/utils';

interface Notification {
	created: string;
	message: string;
	redirect: string;
	read: boolean;
}

async function getNotifications() {
	const response = await fetch('/api/notifications', {
		next: {
			revalidate: 3600,
			tags: ['notifications'],
		},
	});
	const notifications = await response.json();
	return notifications;
}

export default function Notifications() {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	async function markAsRead(ids: string[]) {
		await fetchJSON('/api/notifications', 'PUT', { notifications: ids });
		setNotifications((notifications) =>
			notifications.map((notification) => {
				if (ids.includes(notification.created)) {
					notification.read = true;
				}
				return notification;
			})
		);
	}
	useEffect(() => {
		getNotifications().then((result) => {
			setNotifications(result);
			setLoading(false);
		});
	}, []);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='ghost'
					size='sm'
					className={
						notifications.some((notif) => !notif.read)
							? 'after:border-2 after:box-content after:border-zinc-50 hover:after:border-zinc-200 after:dark:border-zinc-900 dark:hover:after:border-zinc-800 relative after:rounded-full after:content-[""] after:absolute after:top-[4px] after:right-[10px] after:w-2 after:h-2 after:bg-blue-700'
							: ''
					}
				>
					<Bell />
					<span className='sr-only'>Toggle notifications</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className='p-0'>
				<div className='p-4'>
					<span className='text-lg font-semibold'>Notifications</span>
				</div>
				<div className='border-y'>
					{loading ? (
						<Loader className='w-8 h-8 mx-auto my-2' />
					) : (
						<>
							{notifications.map((notification, i) => (
								<Link
									href={notification.redirect}
									key={i}
									className={`grid grid-cols-[0.5rem_1fr_min-content] items-center gap-x-2 p-4 border-b last:border-b-0 hover:brightness-95 dark:hover:brightness-125 ${
										notification.read
											? 'bg-zinc-100 dark:bg-zinc-900'
											: 'bg-zinc-50 dark:bg-zinc-800'
									}`}
									onClick={() => markAsRead([notification.created])}
								>
									{!notification.read ? (
										<span className='w-2 h-2 bg-blue-700 rounded-full shrink-0' />
									) : (
										<span />
									)}
									<div className='flex flex-col text-left'>
										<span className='text-sm'>{notification.message}</span>
										<span className='text-xs text-muted-foreground'>
											{timeSince(new Date(notification.created))} ago
										</span>
									</div>
								</Link>
							))}
						</>
					)}
				</div>
				<div className='p-2'>
					<Button
						variant='outline'
						className='w-full'
						onClick={() => markAsRead(notifications.map((n) => n.created))}
					>
						Mark all as read
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
