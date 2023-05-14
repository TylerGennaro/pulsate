interface Location {
	id: string;
	name: string;
	userId: string;
	products: Product[];
}

interface Product {
	id: string;
	name: string;
	package: string;
	min: number;
	max: number?;
	locationId: string;
}

interface Item {
	id: string;
	product: Product;
	quantity: number;
	expires: Date;
}

interface Log {
	id: string;
	timestamp: Date;
	productId: string;
	userId: string;
	type: 
}

enum LogType {
	QUANTITY_CHANGE,
	ITEM_ADD,
	ITEM_REMOVE,
	STOCK_ORDER
}