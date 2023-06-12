import LogEntry from '@components/LogEntry';
import { Log } from '@prisma/client';

export default async function Logs({ logs }: { logs: Log[] }) {
	return (
		<div className='flex flex-col'>
			{!logs.length && (
				<span className='text-muted-text'>No activity to show</span>
			)}
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
