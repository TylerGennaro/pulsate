'use client';

import { Button } from '@components/ui/button';
import { crud } from '@lib/utils';
import { Item } from '@prisma/client';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ItemArrived({ item }: { item: Item }) {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	async function click() {
		setLoading(true);
		const result = await crud({
			url: `/items`,
			method: 'PUT',
			data: {
				date: item.expires,
				quantity: item.quantity,
				onOrder: false,
			},
			params: { id: item.id },
		});
		if (result.status === 200) {
			router.refresh();
		}
		setLoading(false);
	}
	return (
		<Button variant='outline' icon={Check} onClick={click} isLoading={loading}>
			Arrived
		</Button>
	);
}
