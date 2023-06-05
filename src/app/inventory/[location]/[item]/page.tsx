import QRCode from '@components/QRCode';
import Header from '@components/ui/Header';
import { Button } from '@components/ui/button';
import { cn } from '@lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { db } from '@lib/prisma';
import ItemTable from './ItemTable';
import NewItem from './NewItem';
import { Item, Product } from '@prisma/client';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@components/ui/tooltip';
import { PackageType, Tag } from '@lib/enum';
import { isExpiring } from '@lib/date';
import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/auth';
import SignIn from '@components/SignIn';
import { notFound } from 'next/navigation';
import TagBadge from '@components/TagBadge';
import { packageTypes } from '@lib/relations';
import { Badge } from '@components/ui/badge';
import LogEntry from '@components/LogEntry';
import { Suspense } from 'react';
import { Skeleton } from '@components/ui/skeleton';

function Container({
	children,
	className,
	header,
	description,
	divider = false,
}: {
	children: React.ReactNode;
	className?: string;
	header?: string;
	description?: string;
	divider?: boolean;
}) {
	return (
		<div
			className={cn('bg-foreground border rounded-md p-8 shadow-md', className)}
		>
			{header && (
				<div className='flex flex-col gap-2'>
					<Header size='sm' weight='medium'>
						{header}
					</Header>
					<span className='text-muted-text'>{description}</span>
				</div>
			)}
			{divider && <hr className='my-6' />}
			{children}
		</div>
	);
}

function InfoBlock({
	label,
	value,
	className,
}: {
	label: string;
	value: string;
	className?: string;
}) {
	return (
		<div className={cn('flex flex-col gap-2', className)}>
			<span>{label}</span>
			<span className='text-muted-text'>{value}</span>
		</div>
	);
}

async function getData(
	id: string
): Promise<{ data: (Product & { items: Item[] }) | null; tags: Tag[] }> {
	const data = await db.product.findFirst({
		include: {
			items: {
				orderBy: {
					expires: 'asc',
				},
			},
		},
		where: {
			id,
		},
	});
	const quantity = (
		await db.item.aggregate({
			where: {
				productId: id,
			},
			_sum: {
				quantity: true,
			},
		})
	)._sum.quantity!;
	const exp = data!.items.reduce(
		(acc: Date | string, item: Item) =>
			item.expires !== null && (new Date(item.expires) < acc || acc === '')
				? new Date(item.expires)
				: acc,
		''
	);
	const tags = [];
	if (quantity! < data!.min) tags.push(Tag.LOW);
	if (isExpiring(exp) && quantity > 0) tags.push(Tag.EXPIRES);
	if (data?.items.some((item) => item.onOrder)) tags.push(Tag.ONORDER);
	return { data, tags };
}

async function getUser(id: string) {
	const location = await db.product.findFirst({
		select: {
			location: {
				select: {
					userId: true,
				},
			},
		},
		where: {
			id,
		},
	});
	return location?.location.userId;
}

export default async function Inventory({
	params,
}: {
	params: { location: string; item: string };
}) {
	const session = await getServerSession(authOptions);
	if (!session) return <SignIn />;
	const userId = await getUser(params.item);
	if (userId !== session.user?.id) return notFound();

	const { data, tags } = await getData(params.item);
	if (!data) return null;

	const units = packageTypes[data.package as PackageType];
	return (
		<div className='container py-8'>
			<Link href={`/inventory/${params.location}`}>
				<Button
					className='w-fit mb-8 p-0 hover:bg-background hover:text-muted-foreground'
					variant='ghost'
				>
					<ChevronLeft className='w-4 h-4 mr-2' />
					Go back
				</Button>
			</Link>
			<div className='flex flex-col gap-8'>
				<Container
					header='Information'
					description='General product information'
					divider
				>
					<div className='grid md:grid-cols-2 grid-cols-1 gap-8'>
						<InfoBlock label='Name' value={data.name} />
						<InfoBlock label='Unique ID' value={data.id} />
						<InfoBlock
							label='Minimum quantity'
							value={data.min.toString() + ` ${units}`}
						/>
						<InfoBlock
							label='Maximum quantity'
							value={
								data.max ? data.max?.toString() + ` ${units}` : 'Unlimited'
							}
						/>
						<InfoBlock
							label='Package type'
							value={
								data.package.charAt(0).toUpperCase() + data.package.slice(1)
							}
						/>
						<div className='flex flex-col gap-2'>
							<span>Tags</span>
							<div className='flex gap-2'>
								{tags.length ? (
									tags.map((tag) => {
										return <TagBadge key={tag} tag={tag} />;
									})
								) : (
									<TagBadge tag={Tag.NONE} />
								)}
							</div>
						</div>
					</div>
				</Container>
				<div className='flex flex-col md:flex-row gap-8'>
					<div className='w-full'>
						<Container className='w-full'>
							<div className='mb-8 flex justify-between items-center flex-wrap gap-4'>
								<div className='flex flex-col gap-1'>
									<span className='text-muted-foreground text-md'>Total</span>
									<span className='text-xl font-semibold'>
										{data.items.reduce((acc, val) => (acc += val.quantity), 0)}{' '}
										{packageTypes[data.package as PackageType]}
									</span>
								</div>

								<NewItem product={params.item} />
							</div>
							<ItemTable data={data.items} />
						</Container>
						<Container
							className='w-full mt-8'
							header='Change Log'
							description='All changes made to the product'
							divider
						>
							<Suspense fallback={<Skeleton className='w-full h-16' />}>
								{/* @ts-ignore */}
								<LogEntry
									entry={`{"type": "User", "id": "clig6qhpb0000vgnom3bafngl"} removed {"type": "Product", "id": "clhk4wje70003vocghlimcp97", "quantity": 3} from inventory`}
								/>
							</Suspense>
							{/* <DataTable columns={columns} data={data} /> */}
						</Container>
					</div>
					<Container className='flex flex-col items-center h-fit'>
						<QRCode
							location={params.location}
							uid={params.item}
							name={data.name}
						/>
					</Container>
				</div>
			</div>
		</div>
	);
}
