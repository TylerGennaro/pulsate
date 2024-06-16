import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@lib/utils';

const badgeVariants = cva(
	'inline-flex items-center border rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
	{
		variants: {
			variant: {
				default:
					'bg-primary hover:bg-primary/80 border-transparent text-primary-foreground',
				secondary:
					'bg-secondary hover:bg-secondary/80 border-transparent text-secondary-foreground',
				destructive:
					'bg-destructive hover:bg-destructive/80 border-transparent text-destructive-foreground',
				outline: 'text-foreground',
				success: 'bg-green-700 hover:bg-green-700/80 border-transparent',
				ghost: 'bg-primary/20 text-primary-foreground border-primary/20',
			},
			color: {
				default: 'text-foreground',
				red: 'border-red-500 text-red-500',
				blue: 'border-blue-500 text-blue-500',
				yellow: 'border-yellow-500 text-yellow-500',
				orange: 'border-orange-500 text-orange-500',
				green: 'border-green-500 text-green-500',
				gray: 'border-gray-500 text-gray-500',
				purple: 'border-purple-500 text-purple-500',
			},
		},
		compoundVariants: [
			{
				variant: 'ghost',
				color: 'default',
				class: 'bg-primary/20 text-primary border-primary/20',
			},
			{
				variant: 'ghost',
				color: 'red',
				class: 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30',
			},
			{
				variant: 'ghost',
				color: 'blue',
				class:
					'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30',
			},
			{
				variant: 'ghost',
				color: 'yellow',
				class:
					'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
			},
			{
				variant: 'ghost',
				color: 'orange',
				class:
					'bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30',
			},
			{
				variant: 'ghost',
				color: 'green',
				class:
					'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
			},
			{
				variant: 'ghost',
				color: 'gray',
				class:
					'bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30',
			},
			{
				variant: 'ghost',
				color: 'purple',
				class:
					'bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30',
			},
			{
				variant: 'default',
				color: 'default',
				class: 'text-foreground',
			},
		],
		defaultVariants: {
			variant: 'default',
			color: 'default',
		},
	}
);

export interface BadgeProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, color, ...props }: BadgeProps) {
	return (
		<div
			className={cn(badgeVariants({ variant, color }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
