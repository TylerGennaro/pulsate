import { Button } from '@components/ui/button';
import { cn, populateMetadata } from '@lib/utils';
import { ChevronLeft, ExternalLink, Pencil, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { db } from '@lib/prisma';
import ItemTable from './(components)/ItemTable';
import NewItem from './(components)/NewItem';
import { Item, Product } from '@prisma/client';
import { PackageType, Tag } from '@lib/enum';
import { formatUTCDate, isExpiring } from '@lib/date';
import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/auth';
import SignIn from '@components/SignIn';
import { notFound } from 'next/navigation';
import TagBadge from '@components/TagBadge';
import { packageTypes } from '@lib/relations';
import { Suspense } from 'react';
import { Skeleton } from '@components/ui/skeleton';
import Container from '@components/Container';
import Logs from './Logs';
import EditProduct from '../(components)/EditProduct';
import PrintQRCode from './(components)/PrintQRCode';
import OrderItem from './(components)/OrderItem';

export async function generateMetadata({
	params,
}: {
	params: { item: string };
}) {
	const data = await db.product.findFirst({
		select: {
			name: true,
		},
		where: {
			id: params.item,
		},
	});
	return populateMetadata(data?.name!);
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
			<span className='text-muted-foreground'>{value}</span>
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
			logs: {
				include: {
					product: true,
					user: true,
				},
				take: 5,
				orderBy: {
					timestamp: 'desc',
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
				onOrder: false,
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
			<Link href={`/app/${params.location}`}>
				<Button className='p-2 mb-4 w-fit' variant='ghost'>
					<ChevronLeft className='w-4 h-4 mr-2' />
					Go back
				</Button>
			</Link>
			<div className='grid grid-cols-1 gap-8 xl:grid-cols-2'>
				<Container
					header='Information'
					description='General product information'
					divider
					className='xl:col-span-2'
					action={
						<div className='flex flex-wrap gap-2'>
							<Link
								href={data.url || process.env.NEXT_PUBLIC_PROJECT_URL!}
								target='_blank'
							>
								<Button variant='outline'>
									Go to Page <ExternalLink className='icon-right' />
								</Button>
							</Link>
							<EditProduct
								id={params.item}
								defaultValues={{
									name: data.name,
									min: data.min,
									max: data.max || undefined,
									packageType: data.package as PackageType,
									position: data.position || undefined,
									url: data.url || undefined,
								}}
							>
								<Button>
									<Pencil className='w-4 h-4 mr-2' />
									Update
								</Button>
							</EditProduct>
						</div>
					}
				>
					<div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
						<InfoBlock label='Name' value={data.name} />
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
						<InfoBlock
							label='Position'
							value={data.position || 'None specified'}
						/>
						<InfoBlock
							label='Last Ordered'
							value={
								data.lastOrder !== null
									? formatUTCDate(data.lastOrder)
									: 'Never'
							}
						/>
					</div>
				</Container>
				<Container
					header='Feed'
					description='All changes made to the product'
					divider
					className='overflow-hidden max-h-min'
				>
					<Suspense fallback={<Skeleton className='w-full h-16' />}>
						{/* @ts-expect-error */}
						<Logs logs={data.logs} />
					</Suspense>
					{/* <DataTable columns={columns} data={data} /> */}
				</Container>
				<Container
					className='h-fit'
					header='QR Code'
					description='A redirect code to the checkout page'
					divider
				>
					<PrintQRCode
						location={params.location}
						id={params.item}
						name={data.name}
					/>
				</Container>
				<Container className='xl:col-span-2'>
					<div className='flex flex-wrap items-center justify-between gap-4 mb-8'>
						<div className='flex flex-col gap-1'>
							<span className='text-muted-foreground text-md'>Total</span>
							<span className='text-xl font-semibold'>
								{data.items.reduce((acc, val) => (acc += val.quantity), 0)}{' '}
								{packageTypes[data.package as PackageType]}
							</span>
						</div>
						<div className='flex flex-wrap gap-2'>
							<Link href={`/checkout/${params.item}`}>
								<Button variant='outline'>
									<ShoppingCart className='w-4 h-4 mr-2' />
									Checkout
								</Button>
							</Link>
							<OrderItem product={data} />
							<NewItem product={params.item} />
						</div>
					</div>
					<ItemTable data={data.items} />
				</Container>
			</div>
		</div>
	);
}
