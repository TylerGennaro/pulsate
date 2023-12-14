import { cn } from '@lib/utils';
import Header from './ui/header';
import Balancer from 'react-wrap-balancer';

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
	size = 'xl',
	children,
	className,
}: Props) {
	return (
		<div
			className={cn(
				'flex flex-col items-center gap-2 max-w-screen-sm',
				className
			)}
		>
			<Header size={size} className='leading-tight tracking-tight text-center'>
				<Balancer>{title}</Balancer>
			</Header>
			<span className='w-3/4 mb-2 leading-normal text-center text-muted-foreground'>
				<Balancer className='text-center'>{description}</Balancer>
			</span>
			<div className='flex gap-2 mt-2'>{children}</div>
		</div>
	);
}
