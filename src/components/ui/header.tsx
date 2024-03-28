import { VariantProps, cva } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/lib/utils';

const headerVariants = cva('text-foreground-text', {
	variants: {
		size: {
			default: 'text-3xl',
			sm: 'text-xl',
			md: 'text-2xl',
			lg: 'text-2xl lg:text-4xl',
			xl: 'text-3xl lg:text-5xl',
			'2xl': 'text-4xl lg:text-6xl',
			'3xl': 'text-5xl lg:text-7xl',
		},
		weight: {
			default: 'font-bold',
			thin: 'font-thin',
			light: 'font-light',
			normal: 'font-normal',
			medium: 'font-medium',
			semibold: 'font-semibold',
			bold: 'font-bold',
		},
	},
	defaultVariants: {
		size: 'default',
		weight: 'default',
	},
});

interface HeaderProps
	extends React.HTMLAttributes<HTMLHeadingElement>,
		VariantProps<typeof headerVariants> {}

const Header = React.forwardRef<HTMLHeadingElement, HeaderProps>(
	({ className, children, size, weight, ...props }, ref) => {
		return (
			<h1
				className={cn(headerVariants({ size, weight, className }))}
				ref={ref}
				{...props}
			>
				{children}
			</h1>
		);
	}
);

Header.displayName = 'Header';
export default Header;
