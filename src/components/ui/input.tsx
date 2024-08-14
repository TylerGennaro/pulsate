import * as React from 'react';

import { cn } from '@lib/utils';

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	startIcon?: React.ReactNode;
	wrapperClass?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, wrapperClass, startIcon, ...props }, ref) => {
		return (
			<div className={cn('relative w-full', wrapperClass)}>
				<input
					type={type}
					className={cn(
						'flex w-full rounded-md bg-muted/30 border outline-none focus-visible:border-muted-foreground/30 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 ring-offset-zinc-100 dark:focus-visible:ring-zinc-700 dark:ring-offset-zinc-900',
						className,
						startIcon ? 'pl-10' : undefined
					)}
					ref={ref}
					{...props}
				/>
				{React.isValidElement(startIcon) && (
					<div className='absolute top-0 left-0 grid w-10 h-full pointer-events-none place-content-center'>
						{React.cloneElement(startIcon as React.ReactElement, {
							className: 'w-4 h-4 text-muted-foreground',
						})}
					</div>
				)}
			</div>
		);
	}
);
Input.displayName = 'Input';

export { Input };
