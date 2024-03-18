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
				className='block leading-tight tracking-tight text-center duration-500 animate-in fade-in slide-in-from-bottom-6 bg-gradient-to-br from-black to-zinc-700 dark:from-white dark:to-zinc-400 bg-clip-text !text-transparent'
			>
				<Balancer>{title}</Balancer>
			</Header>
			<span className='w-3/4 mb-2 text-lg leading-normal text-center duration-500 delay-75 text-muted-foreground animate-in fade-in slide-in-from-bottom-6'>
				<Balancer className='text-center'>{description}</Balancer>
			</span>
			<div className='flex gap-2 mt-2 duration-500 delay-150 animate-in fade-in slide-in-from-bottom-6'>
				{children}
			</div>
		</div>
	);
}
