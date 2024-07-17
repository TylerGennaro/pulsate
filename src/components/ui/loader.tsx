import { cn } from '@lib/utils';
import { Loader2 as LoaderIcon } from 'lucide-react';

export default function Loader({ className }: { className?: string }) {
	return (
		<div className='w-12 h-12 border-[6px] rounded-full border-primary/10'>
			<div
				className={cn(
					'w-12 h-12 -ml-1.5 -mt-1.5 rounded-full border-[6px] border-primary border-t-transparent border-r-transparent animate-spin',
					className
				)}
			/>
		</div>
	);
}
