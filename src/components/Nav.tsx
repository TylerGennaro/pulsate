'use client';

import {
	LayoutDashboard,
	LucideIcon,
	Plus,
	Settings,
	Warehouse,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import Indicator, { indicatorVariants } from './ui/indicator';
import { tags as tagRelations } from '@lib/relations';
import { Tag } from '@lib/enum';
import NewLocation from './NewLocation';
import { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from './ui/skeleton';

function NavBlock({
	label,
	children,
}: {
	label?: string | ReactNode;
	children: React.ReactNode;
}) {
	return (
		<div className='flex flex-col gap-1'>
			{label && (
				<span className='mb-2 text-xs font-semibold text-zinc-500'>
					{label}
				</span>
			)}
			{children}
		</div>
	);
}

interface NavButtonProps {
	link: string;
	selected?: boolean;
	icon?: LucideIcon;
	children: React.ReactNode;
	tags?: Tag[];
	disabled?: boolean;
}

function NavButton({
	selected,
	tags,
	children,
	link,
	disabled,
	...props
}: NavButtonProps & React.ComponentPropsWithoutRef<'a'>) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Link
					href={link}
					onClick={props.onClick}
					className={`${disabled ? 'pointer-events-none' : ''}`}
				>
					<Button
						className={`w-full flex bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground group ${
							selected ? 'bg-muted text-foreground' : ''
						}`}
						disabled={disabled}
						variant='ghost'
					>
						{props.icon && (
							<props.icon
								className={`mr-2 transition-transform shrink-0 group-hover:scale-100 ${
									selected ? 'scale-100' : 'scale-90'
								}`}
							/>
						)}
						<div className='w-full overflow-hidden text-left overflow-ellipsis'>
							<span className='whitespace-nowrap'>{children}</span>
						</div>
						{tags && (
							<div className='flex gap-1 ml-2 shrink-0'>
								{tags.map((tag) => (
									<Indicator
										color={
											tagRelations[tag]
												.color as typeof indicatorVariants.prototype.props.color
										}
										key={tag}
									/>
								))}
							</div>
						)}
					</Button>
				</Link>
			</TooltipTrigger>
			<TooltipContent side='right'>{children}</TooltipContent>
		</Tooltip>
	);
}

const navItems = [
	{
		label: 'Dashboard',
		icon: LayoutDashboard,
		link: '/',
	},
	{
		label: 'Settings',
		icon: Settings,
		link: '/settings',
		disabled: true,
	},
];

export function Nav({ toggle }: { toggle: (open: boolean) => void }) {
	const pathname = usePathname();
	const {
		data: locations,
		isLoading,
	}: { data: LocationInfo[] | undefined; isLoading: boolean } = useQuery({
		queryKey: ['locations'],
		queryFn: async () => {
			const res = await fetch('/api/locations');
			const json: { locations: LocationInfo[] } = await res.json();
			return json.locations;
		},
	});
	return (
		<div className='flex flex-col gap-8'>
			<NavBlock>
				{navItems.map((item) => (
					<NavButton
						key={item.label}
						link={`/app${item.link}`}
						icon={item.icon}
						selected={
							(item.link === '/' && pathname === '/app') ||
							(pathname.startsWith(`/app${item.link}`) && item.link !== '/')
						}
						onClick={() => toggle(false)}
						disabled={item.disabled}
					>
						{item.label}
					</NavButton>
				))}
			</NavBlock>
			<NavBlock
				label={
					<span className='flex items-center justify-between'>
						Locations
						<NewLocation />
					</span>
				}
			>
				{locations ? (
					locations.map((location) => (
						<NavButton
							key={location.id}
							link={`/app/${location.id}`}
							icon={Warehouse}
							tags={location.tags}
							selected={pathname.startsWith(`/app/${location.id}`)}
							onClick={() => toggle(false)}
						>
							{location.name}
						</NavButton>
					))
				) : (
					<>
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton key={i} className='h-8 my-1' />
						))}
					</>
				)}
			</NavBlock>
		</div>
	);
}
