import { db } from '@lib/prisma';
import { Product, User } from '@prisma/client';
import { Badge } from './ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

function InlineBadge({
	children,
	color,
}: {
	children: React.ReactNode;
	color?: string;
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
					<Avatar className='cursor-pointer'>
						<AvatarImage src={user.image || undefined} />
						<AvatarFallback>
							{user.name?.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className='flex flex-col gap-2'>
						<span>{user.name}</span>
						<span className='text-muted-text text-sm'>{user.email}</span>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}

function ProductPopover({ product }: { product: Product | null }) {
	if (!product) return <span>Unknown Product</span>;
	return <InlineBadge color='blue'>{product.name}</InlineBadge>;
}

export default async function LogEntry({ entry }: { entry: string }) {
	// await new Promise((resolve) => setTimeout(resolve, 4000));
	const dynamicJSON = entry.match(/{([^}]+)}/g);
	if (!dynamicJSON || !dynamicJSON.length) return <div>{entry}</div>;

	const jsonContent = dynamicJSON?.map((json) => JSON.parse(json));
	const dynamicElements = jsonContent?.map(async (json) => {
		if (json.type === 'User') {
			const user = await db.user.findFirst({
				where: {
					id: json.id,
				},
			});
			return <UserPopover user={user} key={json.id} />;
		}
		if (json.type === 'Product') {
			const product = await db.product.findFirst({
				where: {
					id: json.id,
				},
			});
			return <ProductPopover product={product} key={json.id} />;
		}
	});
	const completedElements = await Promise.all(dynamicElements);
	const split = entry.split(/({[^}]+})/g);
	const joint = split.map((str) => {
		if (dynamicJSON.includes(str)) {
			const index = dynamicJSON.indexOf(str);
			return completedElements[index];
		}
		return str;
	});
	return (
		<div className='flex justify-between items-center leading-8'>
			<div>{joint}</div>
			<span className='text-muted-text shrink-0'>1d ago</span>
		</div>
	);
}
