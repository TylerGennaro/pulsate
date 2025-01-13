'use client';

import ArrowButton from '@components/ArrowButton';
import QrReader from '@components/QrReader';
import { Button } from '@components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';
import Heading from '@components/ui/heading';
import { Skeleton } from '@components/ui/skeleton';
import { toast } from '@components/ui/use-toast';
import { Item } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link as LinkIcon, ScanQrCode, ShoppingCart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import ItemCard from './ItemCard';

export default function Checkout({ productId }: { productId: string }) {
	const queryClient = useQueryClient();
	const session = useSession();
	const router = useRouter();
	const [cart, setCart] = useState<Map<number, number>>(new Map());

	const { data, isLoading } = useQuery({
		queryKey: ['product', productId],
		queryFn: async () => {
			const res = await fetch(`/api/checkout?productId=${productId}`);
			return res.json();
		},
	});
	const { mutate, isPending } = useMutation({
		mutationFn: () => {
			const data = Array.from(cart).map(([id, quantity]) => ({ id, quantity }));
			return fetch(`/api/checkout?productId=${productId}`, {
				method: 'POST',
				body: JSON.stringify(data),
			});
		},
		onSuccess: async (res) => {
			if (res.ok) {
				setCart(new Map());
				queryClient.invalidateQueries({ queryKey: ['product', productId] });
				toast.success('Checkout recorded');
			} else toast.error('Failed', (await res.json()).message);
		},
	});

	const onScanSuccess = (result: string) => {
		const match = result.match(
			/^https:\/\/pulsate.cloud\/checkout\/([\w-]+)\/?$/
		);
		if (match) {
			const id = match[1];
			router.push(`/checkout/${id}`);
		} else {
			toast.error('Could not find product.');
		}
	};

	const cartTotal = useMemo(() => {
		return Array.from(cart).reduce((acc, [, quantity]) => acc + quantity, 0);
	}, [cart]);

	return (
		<div className='flex flex-col'>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				{isLoading ? (
					<div>
						<Skeleton className='w-40 h-8' />
						<Skeleton className='h-6 mt-2 w-96' />
					</div>
				) : (
					<Heading
						header={data.name}
						description={`Checkout ${data.name} from ${data.location.name}`}
					/>
				)}
				<div className='flex gap-2'>
					{!isLoading && session?.data?.user.id === data.location.userId && (
						<Link href={`/app/${data.location.id}/${productId}`}>
							<ArrowButton Icon={LinkIcon}>View Page</ArrowButton>
						</Link>
					)}
					<Dialog>
						<DialogTrigger asChild>
							<Button icon={ScanQrCode} variant='primary'>
								Scan
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Scan QR Code</DialogTitle>
								<DialogDescription>
									Scan a QR code to checkout a new product.
								</DialogDescription>
							</DialogHeader>
							<QrReader onScanSuccess={onScanSuccess} />
						</DialogContent>
					</Dialog>
				</div>
			</div>
			<hr className='mt-6' />
			{/* <form onSubmit={mutate}> */}
			{isLoading ? (
				<ul>
					{Array.from({ length: 3 }).map((_, index) => (
						<li key={index} className='block py-4 border-b'>
							<Skeleton className='w-full h-32' />
						</li>
					))}
				</ul>
			) : (
				<>
					{!data.items.length ? (
						<div className='flex flex-col items-center gap-2 mt-8'>
							<span className='text-lg'>Out of stock</span>
							<span className='text-muted-foreground'>
								Contact your manager
							</span>
						</div>
					) : (
						<>
							{data.items.map((item: Item, index: number) => (
								<div key={index}>
									<ItemCard
										item={item}
										packageType={data.package}
										cart={cart}
										setCart={setCart}
									/>
									<hr />
								</div>
							))}
						</>
					)}
				</>
			)}
			<ArrowButton
				Icon={ShoppingCart}
				className='self-end mt-8 w-fit'
				disabled={isLoading || !data.items.length || !cartTotal}
				type='submit'
				isLoading={isPending}
				onClick={() => mutate()}
				variant='primary'
			>
				Checkout ({cartTotal} items)
			</ArrowButton>
			{/* </form> */}
		</div>
	);
}
