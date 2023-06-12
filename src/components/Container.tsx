import { cn } from '@lib/utils';
import Heading from './ui/heading';

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
			{header && <Heading header={header} description={description} />}
			{divider && <hr className='my-6' />}
			{children}
		</div>
	);
}
