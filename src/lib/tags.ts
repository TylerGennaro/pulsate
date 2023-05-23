import { ArrowDownCircle, CalendarClock, Package2 } from 'lucide-react';
import { Tag } from './enum';

export const tags = {
	[Tag.LOW]: {
		value: 'low',
		label: 'Low',
		icon: ArrowDownCircle,
		color: 'red',
	},
	[Tag.EXPIRES]: {
		value: 'expires',
		label: 'Expires Soon',
		icon: CalendarClock,
		color: 'yellow',
	},
	[Tag.ONORDER]: {
		value: 'onOrder',
		label: 'On Order',
		icon: Package2,
		color: 'blue',
	},
};
