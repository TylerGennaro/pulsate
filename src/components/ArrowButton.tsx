import { cn } from '@lib/utils';
import { ArrowRight, LucideIcon } from 'lucide-react';
import {
	ButtonHTMLAttributes,
	ComponentProps,
	ReactNode,
	forwardRef,
} from 'react';
import { Button } from './ui/button';

type ArrowButtonProps = ComponentProps<typeof Button> &
	ButtonHTMLAttributes<HTMLButtonElement> & {
		children: ReactNode;
		className?: string;
		Icon?: LucideIcon;
	};

const ArrowButton = forwardRef<HTMLButtonElement, ArrowButtonProps>(
	({ children, className, Icon, ...props }, ref) => {
		return (
			<Button className={cn('relative group', className)} ref={ref} {...props}>
				{Icon && (
					<Icon className='group-hover:[transition:_opacity_100ms,_transform_150ms] [transition:_opacity_100ms_linear_50ms,_transform_150ms] opacity-100 icon-left group-hover:-translate-x-6 group-hover:opacity-0' />
				)}
				<span
					className={`${Icon ? 'group-hover:-translate-x-6' : ''} transition`}
				>
					{children}
				</span>
				<ArrowRight
					className={`${
						Icon
							? 'absolute opacity-0 right-8 group-hover:translate-x-5'
							: 'group-hover:translate-x-1'
					} transition icon-right group-hover:opacity-100`}
				/>
			</Button>
		);
	}
);

ArrowButton.displayName = 'ArrowButton';

export default ArrowButton;
