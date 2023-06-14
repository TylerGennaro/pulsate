import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@lib/utils';
import { Loader2, LucideIcon } from 'lucide-react';

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-zinc-100 dark:focus-visible:ring-zinc-700 dark:ring-offset-zinc-900',
	{
		variants: {
			variant: {
				default: 'bg-blue-700 hover:bg-blue-600 text-zinc-50',
				destructive: 'bg-red-700 hover:bg-red-600 text-zinc-50',
				outline: 'border hover:bg-zinc-200 dark:hover:bg-zinc-800',
				ghost: 'hover:bg-zinc-200 dark:hover:bg-zinc-800',
				link: 'underline-offset-4 hover:underline text-blue-700',
			},
			size: {
				default: 'h-10 py-2 px-4',
				sm: 'h-9 px-3 rounded-md',
				lg: 'h-11 px-8 rounded-md',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	icon?: LucideIcon;
	iconPosition?: 'left' | 'right';
	isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			asChild = false,
			isLoading = false,
			children,
			iconPosition = 'left',
			...props
		},
		ref
	) => {
		if (asChild) {
			return (
				<Slot
					className={cn(
						buttonVariants({ variant, size, className }),
						isLoading ? 'opacity-50 pointer-events-none' : ''
					)}
					ref={ref}
					{...props}
				>
					{children}
				</Slot>
			);
		}
		return (
			<button
				className={cn(
					buttonVariants({ variant, size, className }),
					isLoading ? 'opacity-50 pointer-events-none' : ''
				)}
				ref={ref}
				{...props}
			>
				<>
					{iconPosition === 'left' ? null : children}
					{isLoading ? (
						<Loader2 className='w-4 h-4 mr-2 animate-spin' />
					) : props.icon ? (
						<props.icon className='w-4 h-4 mr-2' />
					) : null}
					{iconPosition === 'left' ? children : null}
				</>
			</button>
		);
	}
);
Button.displayName = 'Button';

export { Button, buttonVariants };
