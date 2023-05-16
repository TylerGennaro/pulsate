import { ArrowDownCircle, CalendarClock } from 'lucide-react';
import { Tag } from './enum';

export const tags = {
	[Tag.LOW]: {
		value: 'low',
		label: 'Low',
		icon: ArrowDownCircle,
		color: 'red-500',
	},
	[Tag.EXPIRES]: {
		value: 'expires',
		label: 'Expires Soon',
		icon: CalendarClock,
		color: 'yellow-500',
	},
};
