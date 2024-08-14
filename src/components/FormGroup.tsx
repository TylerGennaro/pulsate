import React from 'react';
import { Input } from './ui/input';
import { cn } from '@lib/utils';

interface FormGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	desc?: string;
	vertical?: boolean;
}

const FormGroup = React.forwardRef<HTMLInputElement, FormGroupProps>(
	({ label, desc, vertical, ...props }, ref) => {
		return (
			<div
				className={
					vertical
						? 'flex flex-col gap-2'
						: 'grid items-center grid-cols-4 gap-y-1'
				}
			>
				<label className={vertical ? '' : 'col-span-1 mr-4 text-right'}>
					{label}
					{props.required && <span className='ml-1 text-red-500'>*</span>}
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
FormGroup.displayName = 'FormGroup';

export default FormGroup;
