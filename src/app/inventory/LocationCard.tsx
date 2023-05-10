import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@components/ui/card';
import Link from 'next/link';
import { Location } from './page';
import { Badge } from '@components/ui/badge';

interface LocationProps {
	location: Location;
}

export default function LocationCard({ location }: LocationProps) {
	return (
		<Link href='/inventory/station-154'>
			<Card className='cursor-pointer hover:bg-secondary transition-colors'>
				<CardHeader>
					<CardTitle>{location.name}</CardTitle>
					<CardDescription>Inventory managed by Eric Gennaro</CardDescription>
				</CardHeader>
				<CardContent>
					{location.hasLow && (
						<Badge className='border-red-500 text-red-500' variant='outline'>
							Low Inventory
						</Badge>
					)}
					{location.hasExpired && (
						<Badge
							className='border-yellow-500 text-yellow-500'
							variant='outline'
						>
							Expired Inventory
						</Badge>
					)}
				</CardContent>
			</Card>
		</Link>
	);
}
