import { cn } from '@lib/utils';
import Heading from './ui/heading';

export default function Container({
	children,
	className,
	header,
	description,
	divider = false,
	action,
}: {
	children: React.ReactNode;
	className?: string;
	header?: string;
	description?: string;
	divider?: boolean;
	action?: React.ReactNode;
}) {
	return (
		<div
			className={cn(
				'bg-content border rounded-md p-4 lg:p-8 shadow-md',
				className
			)}
		>
			<div className='flex flex-wrap items-center justify-between gap-y-4'>
				{header && <Heading header={header} description={description} />}
				{action}
			</div>
			{divider && <hr className='my-6' />}
			{children}
		</div>
	);
}
