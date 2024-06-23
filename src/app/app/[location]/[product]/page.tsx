import { Button } from '@components/ui/button';
import { cn, populateMetadata } from '@lib/utils';
import {
	ChevronLeft,
	ExternalLink,
	MoreVertical,
	Pencil,
	ShoppingCart,
	Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { db } from '@lib/prisma';
import ItemTable from '@components/product/ItemTable';
import NewItem from '@components/product/NewItem';
import { Item, Product } from '@prisma/client';
import { PackageType, Tag } from '@lib/enum';
import { formatUTCDate, isExpired } from '@lib/date';
import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/auth';
import SignIn from '@components/SignIn';
import { notFound } from 'next/navigation';
import TagBadge from '@components/TagBadge';
import { packageTypes } from '@lib/relations';
import { Suspense } from 'react';
import { Skeleton } from '@components/ui/skeleton';
import Container from '@components/Container';
import Logs from '@components/product/Logs';
import OrderItem from '@components/product/OrderItem';
import EditProduct from '@components/location/EditProduct';
import PrintQRCode from '@components/product/PrintQRCode';
import Header from '@components/ui/header';
import ArrowButton from '@components/ArrowButton';
import ActivityTable from '@components/ActivityTable';
import DeleteProduct from '@components/product/DeleteProduct';

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
	if (isExpired(exp) && quantity > 0) tags.push(Tag.EXPIRES);
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
	params: { location: string; product: string };
}) {
	const session = await getServerSession(authOptions);
	if (!session) return <SignIn />;
	const userId = await getUser(params.product);
	if (userId !== session.user?.id) return notFound();

	const { data, tags } = await getData(params.product);
	if (!data) return null;

	const units = packageTypes[data.package as PackageType];
	return (
		<div className='lg:px-2'>
			<div className='flex items-center gap-4 my-4'>
				<Link href={`/app/${params.location}`} className='block w-fit'>
					<Button size='icon' variant='outline' className='bg-content'>
						<ChevronLeft size={16} />
					</Button>
				</Link>
				<Header size='md'>{data.name}</Header>
				<div className='flex gap-2'>
					{tags.length > 0 &&
						tags.map((tag) => {
							return <TagBadge key={tag} tag={tag} />;
						})}
				</div>
			</div>
			<div className='flex gap-8'>
				<div className='flex flex-col w-full gap-8'>
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
								<Link href={`/checkout/${params.product}`}>
									<Button>
										<ShoppingCart className='icon-left' />
										Checkout
									</Button>
								</Link>
								<OrderItem product={data} />
								<NewItem product={params.product} />
							</div>
						</div>
						<ItemTable data={data.items} />
					</Container>
					<Container
						header='Audit'
						description='A log of all quantity changes made to the product.'
						divider
						className='overflow-hidden max-h-min xl:col-span-2'
					>
						<ActivityTable
							locationId={params.location}
							productId={params.product}
						/>
					</Container>
				</div>
				<div className='flex flex-col flex-shrink gap-8'>
					<Container
						header='Information'
						description='General product information'
						divider
						action={
							<div className='flex flex-wrap gap-2'>
								{data.url && (
									<Link href={data.url} target='_blank'>
										<ArrowButton Icon={ExternalLink}>Go to Page</ArrowButton>
									</Link>
								)}
								<EditProduct
									id={params.product}
									defaultValues={{
										name: data.name,
										min: data.min,
										packageType: data.package as PackageType,
										position: data.position || undefined,
										url: data.url || undefined,
									}}
								>
									<Button size='icon' className='min-w-[2.5rem]'>
										<MoreVertical size={16} />
									</Button>
								</EditProduct>
							</div>
						}
					>
						<div className='flex flex-col gap-8'>
							<InfoBlock
								label='Minimum quantity'
								value={data.min.toString() + ` ${units}`}
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
										? formatUTCDate(data.lastOrder)!
										: 'Never'
								}
							/>
						</div>
					</Container>
					<Container
						className='h-fit'
						header='QR Code'
						description='A redirect code to the checkout page'
						divider
					>
						<PrintQRCode
							location={params.location}
							id={params.product}
							name={data.name}
						/>
					</Container>
					<Container
						header='Delete Product'
						description='Delete this product and all its data.'
					>
						<DeleteProduct id={params.product}>
							<Button variant='destructive' className='mt-8'>
								<Trash2 className='icon-left' />
								Delete Product
							</Button>
						</DeleteProduct>
					</Container>
				</div>
			</div>
		</div>
	);
}
