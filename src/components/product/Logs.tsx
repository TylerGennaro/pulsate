import LogEntry from '@components/LogEntry';
import { Log, Product, User } from '@prisma/client';

export default async function Logs({
	logs,
}: {
	logs: (Log & { user: User | null; product: Product })[];
}) {
	return (
		<div className='flex flex-col'>
			{!logs.length && (
				<span className='text-muted-foreground'>No activity to show</span>
			)}
			{logs.map((log, index, arr) => (
				<LogEntry
					key={log.timestamp.toString()}
					log={log}
					last={index === arr.length - 1}
					noLink
				/>
			))}
		</div>
	);
}
