import React, { FC } from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const headerVariants = cva('text-foreground font-bold', {
	variants: {
		size: {
			default: 'text-3xl',
			sm: 'text-xl',
			md: 'text-2xl',
			lg: 'text-4xl',
			xl: 'text-5xl',
		},
	},
	defaultVariants: {
		size: 'default',
	},
});

interface HeaderProps
	extends React.HTMLAttributes<HTMLHeadingElement>,
		VariantProps<typeof headerVariants> {}

const Header = React.forwardRef<HTMLHeadingElement, HeaderProps>(
	({ className, children, size, ...props }, ref) => {
		return (
			<h1
				className={cn(headerVariants({ size, className }))}
				ref={ref}
				{...props}
			>
				{children}
			</h1>
		);
	}
);

export default Header;
