'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { Input } from './input';
import { ScrollArea } from './scroll-area';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './select';

export function DatePicker({
	date = new Date(),
	setDate,
	className,
	disabled,
	modal = false,
	editable = false,
}: {
	date: Date;
	setDate: Dispatch<SetStateAction<Date>>;
	className?: string;
	disabled?: boolean;
	modal?: boolean;
	editable?: boolean;
}) {
	const [open, setOpen] = useState(false);
	const [month, setMonth] = React.useState(
		(date as Date).getMonth() || new Date().getMonth(),
	);
	const [year, setYear] = React.useState(
		(date as Date).getFullYear() || new Date().getFullYear(),
	);
	const inputRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		setTimeout(() => {
			if (open && inputRef.current) {
				inputRef.current.focus();
			}
		}, 1);
	});

	React.useEffect(() => {
		const handleInput = () => {
			console.log('input');
			if (!inputRef.current) return;
			const newValue = inputRef.current.value;
			if (isNaN(parseInt(newValue))) return;
			if (parseInt(newValue) <= 0) return;
			if (newValue.length === 1 && parseInt(newValue) > 1) {
				inputRef.current.value = '0' + parseInt(newValue) + '/';
			}
		};
		inputRef.current?.addEventListener('input', handleInput);
		return () => inputRef.current?.removeEventListener('input', handleInput);
	}, []);

	return (
		<>
			<Popover open={open} onOpenChange={setOpen} modal={modal}>
				<PopoverTrigger asChild={!editable}>
					{editable ? (
						<Input
							className={`w-[280px] justify-start text-left font-normal ${
								!editable ? 'hidden' : ''
							}`}
							ref={inputRef}
						/>
					) : (
						<Button
							className={cn(
								'w-[280px] justify-start text-left font-normal bg-muted/30 hover:bg-muted',
								!date && 'text-muted-foreground',
								className,
							)}
							disabled={disabled}
						>
							<CalendarIcon className='w-4 h-4 mr-2' />
							{date ? format(date, 'PPP') : <span>Pick a date</span>}
						</Button>
					)}
				</PopoverTrigger>
				<PopoverContent className='w-auto p-0 max-h-[calc(var(--radix-popper-available-height)_-_10px)] overflow-y-auto'>
					<Calendar
						mode='single'
						selected={date}
						onSelect={newDate => {
							setDate((newDate as Date) || date);
							setOpen(false);
						}}
						month={new Date(year, month)}
						onMonthChange={date => {
							setMonth(date.getMonth());
							setYear(date.getFullYear());
						}}
						captionLayout='dropdown'
						startMonth={new Date(year, 0)}
						endMonth={new Date(year, 0)}
						autoFocus
						components={
							{
								// IconLeft: ({ ...props }) => <ChevronLeft className='w-4 h-4' />,
								// IconRight: ({ ...props }) => <ChevronRight className='w-4 h-4' />,
								// Dropdown: ({ ...props }) => {
								// 	if (props['aria-label'] === 'Month: ') {
								// 		return <p>{format(new Date(0, month), 'MMMM')}</p>;
								// 	}
								// 	return (
								// 		<Select onValueChange={(value) => setYear(parseInt(value))}>
								// 			<SelectTrigger>
								// 				<SelectValue>{year}</SelectValue>
								// 			</SelectTrigger>
								// 			<SelectContent>
								// 				<ScrollArea className='h-52'>
								// 					{React.Children.toArray(props.children).map(
								// 						(option: any, index) => (
								// 							<SelectItem value={option.props.value} key={index}>
								// 								{option.props.children}
								// 							</SelectItem>
								// 						)
								// 					)}
								// 				</ScrollArea>
								// 			</SelectContent>
								// 		</Select>
								// );
								// },
							}
						}
					/>
				</PopoverContent>
			</Popover>
		</>
	);
}
