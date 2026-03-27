'use client';

import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@lib/utils';

function formatDate(date: Date | undefined) {
	if (!date) {
		return '';
	}

	return date.toLocaleDateString('en-US', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});
}

function isValidDate(date: Date | undefined) {
	if (!date) {
		return false;
	}
	return !isNaN(date.getTime());
}

type Calendar28Props = {
	className?: string;
	date: Date;
	setDate: React.Dispatch<React.SetStateAction<Date>>;
	disabled?: boolean;
};

export default function Calendar28({
	className,
	date,
	setDate,
	disabled,
}: Calendar28Props) {
	const [open, setOpen] = React.useState(false);
	const [month, setMonth] = React.useState<Date | undefined>(date);
	const [value, setValue] = React.useState(formatDate(date));
	const [isInputValidDate, setIsInputValidDate] = React.useState(
		isValidDate(date),
	);

	return (
		<div className={cn('flex flex-col gap-3', className)}>
			<div className='relative flex gap-2'>
				<Input
					id='date'
					value={value}
					placeholder='MM/DD/YYYY'
					inputClass='pr-10'
					onChange={e => {
						const parts = e.target.value.split(/[\/\-]/);
						const date = new Date(e.target.value);
						if (
							isValidDate(date) &&
							parts.length === 3 &&
							parts[2].length === 4
						) {
							setValue(formatDate(date));
							setDate(date);
							setMonth(date);
							setIsInputValidDate(true);
						} else {
							setValue(e.target.value);
							setIsInputValidDate(false);
						}
					}}
					onKeyDown={e => {
						if (e.key === 'ArrowDown') {
							e.preventDefault();
							setOpen(true);
						}
					}}
					isValid={isInputValidDate || value.length === 0}
					disabled={disabled}
				/>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							id='date-picker'
							variant='ghost'
							size='icon'
							className='absolute -translate-y-1/2 right-2 top-1/2'
							disabled={disabled}
						>
							<CalendarIcon className='w-4 h-4' />
							<span className='sr-only'>Select date</span>
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className='w-auto p-0 overflow-hidden'
						align='end'
						alignOffset={-8}
						sideOffset={10}
					>
						<Calendar
							mode='single'
							selected={date}
							captionLayout='dropdown'
							month={month}
							onMonthChange={setMonth}
							onSelect={date => {
								setDate(date!);
								setValue(formatDate(date));
								setIsInputValidDate(isValidDate(date));
								setOpen(false);
							}}
						/>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}
