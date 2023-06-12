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

function NavBlock({
	label,
	children,
}: {
	label?: string;
	children: React.ReactNode;
}) {
	return (
		<div className='flex flex-col gap-1'>
			{label && (
				<span className='text-foreground-text/70 text-xs mb-2 font-semibold'>
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
}

function NavButton({
	selected,
	tags,
	children,
	link,
	...props
}: NavButtonProps & React.ComponentPropsWithoutRef<'a'>) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Link href={link} onClick={props.onClick}>
					<Button
						className={`w-full flex text-foreground-text/70 bg-foreground hover:bg-muted hover:text-black dark:hover:text-white ${
							selected ? 'bg-muted text-black dark:text-white' : ''
						}`}
					>
						{props.icon && <props.icon className='mr-2 shrink-0' />}
						<div className='w-full overflow-hidden overflow-ellipsis text-left'>
							<span className='whitespace-nowrap'>{children}</span>
						</div>
						{tags && (
							<div className='ml-2 flex gap-1 shrink-0'>
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
	},
];

export function Nav({
	locations,
	toggle,
}: {
	locations: LocationInfo[] | null;
	toggle: (open: boolean) => void;
}) {
	const pathname = usePathname();
	return (
		<div className='flex flex-col gap-8'>
			<NavBlock>
				{navItems.map((item) => (
					<NavButton
						key={item.label}
						link={`/inventory${item.link}`}
						icon={item.icon}
						selected={
							(item.link === '/' && pathname === '/inventory') ||
							pathname == `/inventory${item.link}`
						}
						onClick={() => toggle(false)}
					>
						{item.label}
					</NavButton>
				))}
			</NavBlock>
			<NavBlock label='Locations'>
				{locations &&
					locations.map((location) => (
						<NavButton
							key={location.id}
							link={`/inventory/${location.id}`}
							icon={Warehouse}
							tags={location.tags}
							selected={pathname.startsWith(`/inventory/${location.id}`)}
							onClick={() => toggle(false)}
						>
							{location.name}
						</NavButton>
					))}
				<NewLocation />
			</NavBlock>
		</div>
	);
}
