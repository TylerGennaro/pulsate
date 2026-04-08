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

	export type ProductListing = Product & {
		quantity: number;
		tags: Tag[];
		exp: number;
	};

	interface PopulatedPayment {
		id: string;
		amount: number;
		status: string;
		created: number;
	}

	export type Permission =
		| 'location.delete' // Location
		| 'location.edit'
		| 'location.permissions'
		| 'product.create' // Product
		| 'product.edit'
		| 'product.delete'
		| 'product.stock'
		| 'product.checkout'
		| 'product.print_qr';

	export type PermissionSet = Set<Permission>;
}
