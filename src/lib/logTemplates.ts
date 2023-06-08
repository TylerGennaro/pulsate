import { LogType } from '@prisma/client';
import {
	FolderCheck,
	FolderMinus,
	FolderPlus,
	LucideIcon,
	Package,
	PackageCheck,
	PackageMinus,
	PackagePlus,
	PackageX,
} from 'lucide-react';

export const templates: Record<
	LogType,
	{
		icon: LucideIcon;
		quantity: boolean;
		badge: { color: string; text: string };
	}
> = {
	[LogType.ITEM_ORDER]: {
		icon: Package,
		quantity: true,
		badge: {
			color: 'blue',
			text: 'Ordered',
		},
	},
	[LogType.ITEM_ADD]: {
		icon: PackagePlus,
		quantity: true,
		badge: {
			color: 'green',
			text: 'Added',
		},
	},
	[LogType.ITEM_REMOVE]: {
		icon: PackageX,
		quantity: true,
		badge: {
			color: 'red',
			text: 'Removed',
		},
	},
	[LogType.ITEM_UPDATE]: {
		icon: PackageCheck,
		quantity: true,
		badge: {
			color: 'purple',
			text: 'Updated',
		},
	},
	[LogType.ITEM_CHECKOUT]: {
		icon: PackageMinus,
		quantity: true,
		badge: {
			color: 'yellow',
			text: 'Checkout',
		},
	},
	[LogType.PRODUCT_ADD]: {
		icon: FolderPlus,
		quantity: false,
		badge: {
			color: 'green',
			text: 'Added',
		},
	},
	[LogType.PRODUCT_REMOVE]: {
		icon: FolderMinus,
		quantity: false,
		badge: {
			color: 'red',
			text: 'Removed',
		},
	},
	[LogType.PRODUCT_UPDATE]: {
		icon: FolderCheck,
		quantity: false,
		badge: {
			color: 'purple',
			text: 'Updated',
		},
	},
};
