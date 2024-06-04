import { ArrowRight, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@lib/utils';

type PlusButtonProps = {
	children: React.ReactNode;
	className?: string;
};

export default function PlusButton({ children, className }: PlusButtonProps) {
	return (
		<Button className={cn('relative group', className)}>
			<Plus className='transition opacity-100 icon-left group-hover:-translate-x-6 group-hover:opacity-0 group-hover:rotate-180' />
			<span className='transition group-hover:-translate-x-6'>{children}</span>
			<ArrowRight className='absolute transition opacity-0 icon-right group-hover:opacity-100 group-hover:translate-x-7' />
		</Button>
	);
}
