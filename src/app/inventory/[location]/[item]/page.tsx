import QRCode from '@components/QRCode';
import { Button } from '@components/ui/button';
import { cn } from '@lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { db } from '@lib/prisma';
import ItemTable from './ItemTable';
import NewItem from './NewItem';
import { Item, Product } from '@prisma/client';
import { PackageType, Tag } from '@lib/enum';
import { isExpiring } from '@lib/date';
import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/auth';
import SignIn from '@components/SignIn';
import { notFound } from 'next/navigation';
import TagBadge from '@components/TagBadge';
import { packageTypes } from '@lib/relations';
import LogEntry from '@components/LogEntry';
import { Suspense } from 'react';
import { Skeleton } from '@components/ui/skeleton';
import Container from '@components/Container';
import Logs from './Logs';

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
		<div className='container'>
			<Link href={`/inventory/${params.location}`}>
				<Button
					className='w-fit mb-8 p-2 text-muted-text hover:bg-foreground hover:text-foreground-text'
					variant='ghost'
				>
					<ChevronLeft className='w-4 h-4 mr-2' />
					Go back
				</Button>
			</Link>
			<div className='grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8'>
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
				<Container className='flex flex-col items-center h-fit'>
					<QRCode
						location={params.location}
						uid={params.item}
						name={data.name}
					/>
				</Container>

				<Container>
					<div className='mb-8 flex justify-between items-center flex-wrap gap-4'>
						<div className='flex flex-col gap-1'>
							<span className='text-muted-text text-md'>Total</span>
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
					className='w-full'
					header='Feed'
					description='All changes made to the product'
					divider
				>
					<Suspense fallback={<Skeleton className='w-full h-16' />}>
						{/* @ts-expect-error */}
						<Logs />
					</Suspense>
					{/* <DataTable columns={columns} data={data} /> */}
				</Container>
			</div>
		</div>
	);
}
