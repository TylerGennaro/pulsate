import React from 'react';
import { Input } from './ui/input';
import { cn } from '@lib/utils';

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	desc?: string;
}

const InputGroup = React.forwardRef<HTMLInputElement, InputGroupProps>(
	({ label, desc, ...props }, ref) => {
		return (
			<div className='grid grid-cols-4 items-center gap-y-1'>
				<label className='col-span-1 text-right mr-4'>
					{label}
					{props.required && <span className='text-red-500 ml-1'>*</span>}
				</label>
				<Input
					className={cn('col-span-3', props.className)}
					ref={ref}
					{...props}
				/>
				{desc && (
					<span className='text-xs text-muted-foreground [grid-column:2/span3]'>
						{desc}
					</span>
				)}
			</div>
		);
	}
);
InputGroup.displayName = 'InputGroup';

export default InputGroup;
