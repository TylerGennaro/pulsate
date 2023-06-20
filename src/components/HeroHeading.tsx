import { cn } from '@lib/utils';
import Header from './ui/header';

interface Props {
	title: string;
	description: string;
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'default';
	children?: React.ReactNode;
	className?: string;
}

export default function HeroHeading({
	title,
	description,
	size = 'default',
	children,
	className,
}: Props) {
	return (
		<div
			className={cn(
				'flex flex-col items-center max-w-screen-md gap-4',
				className
			)}
		>
			<Header size={size} className='text-center'>
				{title}
			</Header>
			<span className='w-3/4 mb-2 text-lg text-center text-muted'>
				{description}
			</span>
			<div className='flex gap-2'>{children}</div>
		</div>
	);
}
