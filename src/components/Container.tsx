import { cn } from '@lib/utils';
import Header from './ui/Header';

export default function Container({
	children,
	className,
	header,
	description,
	divider = false,
}: {
	children: React.ReactNode;
	className?: string;
	header?: string;
	description?: string;
	divider?: boolean;
}) {
	return (
		<div
			className={cn('bg-foreground border rounded-md p-8 shadow-md', className)}
		>
			{header && (
				<div className='flex flex-col gap-2'>
					<Header size='sm' weight='medium'>
						{header}
					</Header>
					<span className='text-muted-text'>{description}</span>
				</div>
			)}
			{divider && <hr className='my-6' />}
			{children}
		</div>
	);
}
