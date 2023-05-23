import { Item, Product } from '@prisma/client';

declare global {
	interface LocationInfo {
		id: string;
		name: string;
		userId: string;
		user?: { name?: string | null };
		products?: Product[];
		hasLow?: boolean;
		hasExpired?: boolean;
	}

	export interface ProductInfo extends Product {
		quantity: number;
		items: Item[];
		tags: Tag[];
	}

	interface Log {
		id: string;
		timestamp: Date;
		productId: string;
		userId: string;
		type: LogType;
	}
}
