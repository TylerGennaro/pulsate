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
	{ icon: LucideIcon; template: string }
> = {
	[LogType.ITEM_ORDER]: {
		icon: Package,
		template: 'Ordered {quantity} {product}',
	},
	[LogType.ITEM_ADD]: {
		icon: PackagePlus,
		template: 'Added {quantity} {product}',
	},
	[LogType.ITEM_REMOVE]: {
		icon: PackageX,
		template: '{user} removed {quantity}x {product}.',
	},
	[LogType.ITEM_UPDATE]: {
		icon: PackageCheck,
		template: '{user} updated the stock for {product}.',
	},
	[LogType.ITEM_CHECKOUT]: {
		icon: PackageMinus,
		template: '{user} checked out {product}.',
	},
	[LogType.PRODUCT_ADD]: {
		icon: FolderPlus,
		template: '{user} created {product}.',
	},
	[LogType.PRODUCT_REMOVE]: {
		icon: FolderMinus,
		template: '{user} removed {product}.',
	},
	[LogType.PRODUCT_UPDATE]: {
		icon: FolderCheck,
		template: '{user} updated {product}.',
	},
};
