'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { cn } from '@lib/utils';

const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
	<CheckboxPrimitive.Root
		ref={ref}
		className={cn(
			'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
			className
		)}
		{...props}
	>
		<CheckboxPrimitive.Indicator
			className={cn('flex items-center justify-center text-current')}
		>
			<Check className='h-4 w-4' />
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

const IndeterminateCheckbox = React.forwardRef<
	React.ElementRef<typeof Checkbox>,
	React.ComponentPropsWithoutRef<typeof Checkbox> & {
		indeterminate?: boolean;
	}
>(({ indeterminate, ...props }, ref) => {
	const internalRef = React.useRef<HTMLInputElement>(null!);

	React.useEffect(() => {
		console.log('indeterminate', indeterminate);
		if (typeof indeterminate === 'boolean' && internalRef.current) {
			internalRef.current.indeterminate = !props.checked && indeterminate;
		}
	}, [indeterminate]);

	return <Checkbox {...props} ref={ref} />;
});
IndeterminateCheckbox.displayName = 'IndeterminateCheckbox';

export { Checkbox, IndeterminateCheckbox };
