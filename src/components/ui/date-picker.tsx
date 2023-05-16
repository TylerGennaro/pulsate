'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Dispatch, SetStateAction, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { ScrollArea } from './scroll-area';

export function DatePicker({
	date,
	setDate,
	className,
}: {
	date: Date;
	setDate: Dispatch<SetStateAction<Date>>;
	className?: string;
}) {
	const [open, setOpen] = useState(false);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'w-[280px] justify-start text-left font-normal',
						!date && 'text-muted-foreground',
						className
					)}
				>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{date ? format(date, 'PPP') : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto p-0 max-h-[calc(var(--radix-popper-available-height)_-_10px)] overflow-y-auto'>
				<Calendar
					mode='single'
					selected={date}
					onSelect={(date) => {
						setDate(date as Date);
						setOpen(false);
					}}
					captionLayout='dropdown-buttons'
					fromYear={new Date().getFullYear()}
					toYear={2050}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
