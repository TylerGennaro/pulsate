import LogEntry from '@components/LogEntry';
import { db } from '@lib/prisma';

async function getLogs(productId: string) {
	const logs = await db.log.findMany({
		where: {
			productId,
		},
		include: {
			user: true,
			product: true,
		},
		orderBy: {
			timestamp: 'desc',
		},
		take: 10,
	});
	return logs;
}

export default async function Logs({ productId }: { productId: string }) {
	const logs = await getLogs(productId);
	return (
		<div className='flex flex-col'>
			{logs.map((log, index, arr) => (
				<LogEntry
					key={log.timestamp.toString()}
					log={log}
					last={index === arr.length - 1}
				/>
			))}
		</div>
	);
}
