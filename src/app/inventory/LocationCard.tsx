'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@components/ui/card';
import Link from 'next/link';
import { Badge } from '@components/ui/badge';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '@styles/globals.css';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';

export default function LocationCard({ location }: { location: LocationInfo }) {
	const percentage = 88;
	const circleColor = `hsl(${(percentage / 100) * 120}, 100%, 35%)`;

	return (
		<Link href={`/inventory/${location.id}`}>
			<Card className='cursor-pointer hover:bg-secondary transition-colors flex justify-between flex-wrap'>
				<div>
					<CardHeader>
						<CardTitle>{location.name}</CardTitle>
						<CardDescription>Managed by {location.user?.name}</CardDescription>
					</CardHeader>
					<CardContent className='flex gap-2'>
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
								Expiring Inventory
							</Badge>
						)}
					</CardContent>
					<CardFooter>
						<Avatar>
							<AvatarImage src={location.user?.image!} />
							<AvatarFallback>{location.user?.name?.[0] || 'A'}</AvatarFallback>
						</Avatar>
					</CardFooter>
				</div>
				<div className='w-24 m-4 flex items-center'>
					{/* <CircularProgressbar
						value={percentage}
						strokeWidth={12}
						text={`${percentage}%`}
						styles={buildStyles({
							trailColor: 'transparent',
							pathColor: circleColor,
							textColor: circleColor,
						})}
					/> */}
				</div>
			</Card>
		</Link>
	);
}
