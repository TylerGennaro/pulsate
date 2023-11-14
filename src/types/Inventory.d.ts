import { Item, Product, User } from '@prisma/client';

declare global {
	interface LocationInfo {
		id: string;
		name: string;
		userId: string;
		user?: User;
		products?: Product[];
		tags?: Tag[];
	}

	export interface ProductInfo extends Product {
		quantity: number;
		items: Item[];
		tags: Tag[];
		exp: string | Date;
	}

	interface PopulatedPayment {
		id: string;
		amount: number;
		status: string;
		created: number;
	}
}
