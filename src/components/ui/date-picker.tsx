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
import { PopoverPortal } from '@radix-ui/react-popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './select';
import { ScrollArea } from './scroll-area';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function DatePicker({
	date = new Date(),
	setDate,
	className,
	disabled,
}: {
	date: Date;
	setDate: Dispatch<SetStateAction<Date>>;
	className?: string;
	disabled?: boolean;
}) {
	const [open, setOpen] = useState(false);
	const [month, setMonth] = React.useState(
		(date as Date).getMonth() || new Date().getMonth()
	);
	const [year, setYear] = React.useState(
		(date as Date).getFullYear() || new Date().getFullYear()
	);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					className={cn(
						'w-[280px] justify-start text-left font-normal bg-muted/30 hover:bg-muted',
						!date && 'text-muted-foreground',
						className
					)}
					disabled={disabled}
				>
					<CalendarIcon className='w-4 h-4 mr-2' />
					{date ? format(date, 'PPP') : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverPortal>
				<PopoverContent className='w-auto p-0 max-h-[calc(var(--radix-popper-available-height)_-_10px)] overflow-y-auto'>
					<Calendar
						mode='single'
						selected={date}
						onSelect={(newDate) => {
							setDate((newDate as Date) || date);
							setOpen(false);
						}}
						month={new Date(year, month)}
						onMonthChange={(date) => {
							setMonth(date.getMonth());
							setYear(date.getFullYear());
						}}
						captionLayout='dropdown-buttons'
						fromYear={new Date().getFullYear() - 1}
						toYear={2050}
						initialFocus
						components={{
							IconLeft: ({ ...props }) => <ChevronLeft className='w-4 h-4' />,
							IconRight: ({ ...props }) => <ChevronRight className='w-4 h-4' />,
							Dropdown: ({ ...props }) => {
								if (props['aria-label'] === 'Month: ') {
									return <p>{format(new Date(0, month), 'MMMM')}</p>;
								}
								return (
									<Select onValueChange={(value) => setYear(parseInt(value))}>
										<SelectTrigger>
											<SelectValue>{year}</SelectValue>
										</SelectTrigger>
										<SelectContent>
											<ScrollArea className='h-52'>
												{React.Children.toArray(props.children).map(
													(option: any, index) => (
														<SelectItem value={option.props.value} key={index}>
															{option.props.children}
														</SelectItem>
													)
												)}
											</ScrollArea>
										</SelectContent>
									</Select>
								);
							},
						}}
					/>
				</PopoverContent>
			</PopoverPortal>
		</Popover>
	);
}
