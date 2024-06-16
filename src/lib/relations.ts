import {
	ArrowDownCircle,
	CalendarClock,
	CalendarOff,
	Package2,
} from 'lucide-react';
import { PackageType, Tag } from './enum';

export const tags = {
	[Tag.LOW]: {
		value: 'low',
		label: 'Low Quantity',
		icon: ArrowDownCircle,
		color: 'red',
	},
	[Tag.EXPIRES]: {
		value: 'expires',
		label: 'Expires Soon',
		icon: CalendarClock,
		color: 'yellow',
	},
	[Tag.EXPIRED]: {
		value: 'expired',
		label: 'Expired',
		icon: CalendarOff,
		color: 'orange',
	},
	[Tag.ONORDER]: {
		value: 'onOrder',
		label: 'On Order',
		icon: Package2,
		color: 'blue',
	},
	[Tag.NONE]: {
		value: 'none',
		label: 'None',
		icon: null,
		color: 'gray',
	},
};

export const packageTypes = {
	[PackageType.SINGLE]: 'items',
	[PackageType.PACK]: 'packs',
	[PackageType.BOX]: 'boxes',
	[PackageType.CASE]: 'cases',
};
