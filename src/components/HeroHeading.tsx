import { cn } from '@lib/utils';
import Header from './ui/header';
import Balancer from 'react-wrap-balancer';

interface Props {
	title: string;
	description: string;
	size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'default';
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
				'flex flex-col items-center gap-2 max-w-screen-lg',
				className
			)}
		>
			<Header
				size={size}
				className='block !leading-tight tracking-tight text-center appear-up bg-gradient-to-br from-black to-zinc-700 dark:from-white dark:to-zinc-400 bg-clip-text !text-transparent'
			>
				<Balancer>{title}</Balancer>
			</Header>
			<span className='w-3/4 mb-2 text-base leading-normal text-center delay-150 lg:text-lg text-muted-foreground appear-up'>
				<Balancer className='text-center'>{description}</Balancer>
			</span>
			<div className='flex gap-2 mt-2 delay-300 appear-up'>{children}</div>
		</div>
	);
}
