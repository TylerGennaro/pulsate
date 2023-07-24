import Container from '@components/Container';
import LogEntry from '@components/LogEntry';
import { Button } from '@components/ui/button';
import { db } from '@lib/prisma';
import { populateMetadata } from '@lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({
	params,
}: {
	params: { locationId: string };
}) {
	const name = await getName(params.locationId);
	return populateMetadata(`${name} Activity`);
}

async function getName(locationId: string) {
	const name = await db.location.findFirst({
		select: {
			name: true,
		},
		where: {
			id: locationId,
		},
	});
	return name?.name;
}

async function getData(locationId: string) {
	const results = await db.log.findMany({
		include: {
			product: true,
			user: true,
		},
		where: {
			product: {
				locationId,
			},
		},
		orderBy: {
			timestamp: 'desc',
		},
	});
	return results;
}

export default async function Page({
	params,
}: {
	params: { location: string };
}) {
	const logs = await getData(params.location);
	const name = await getName(params.location);
	return (
		<div>
			<Link href={`/app/${params.location}`}>
				<Button className='p-2 mb-4 w-fit' variant='ghost'>
					<ChevronLeft className='w-4 h-4 mr-2' />
					Go back
				</Button>
			</Link>
			<Container
				header='Activity Feed'
				description={`All changes for ${name}`}
				divider
			>
				{logs.map((log, index) => (
					<LogEntry log={log} key={log.id} last={index + 1 === logs.length} />
				))}
			</Container>
		</div>
	);
}
