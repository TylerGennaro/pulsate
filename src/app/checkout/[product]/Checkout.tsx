'use client';

import ArrowButton from '@components/ArrowButton';
import { Button } from '@components/ui/button';
import Heading from '@components/ui/heading';
import { Skeleton } from '@components/ui/skeleton';
import { Item } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, ShoppingCart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';
import ItemCard from './ItemCard';
import { toast } from '@components/ui/use-toast';

export default function Checkout({ productId }: { productId: string }) {
	const queryClient = useQueryClient();
	const session = useSession();
	const [cart, setCart] = useState<Map<string, number>>(new Map());

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
				{!isLoading && session?.data?.user.id === data.location.userId && (
					<Link href={`/app/${data.location.id}/${productId}`}>
						<ArrowButton Icon={LinkIcon}>View Page</ArrowButton>
					</Link>
				)}
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
				disabled={isLoading || !data.items.length}
				type='submit'
				isLoading={isPending}
				onClick={() => mutate()}
				variant='primary'
			>
				Checkout (
				{Array.from(cart).reduce((acc, [, quantity]) => acc + quantity, 0)}{' '}
				items)
			</ArrowButton>
			{/* </form> */}
		</div>
	);
}
