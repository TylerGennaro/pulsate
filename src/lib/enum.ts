export enum Constants {
	IS_EXPIRED = 1,
	IS_EXPIRING,
}

export enum LogType {
	QUANTITY_CHANGE,
	ITEM_ADD,
	ITEM_REMOVE,
	STOCK_ORDER,
}

export enum Tag {
	LOW = 'low',
	EXPIRES = 'expires',
	EXPIRED = 'expired',
	ONORDER = 'onOrder',
}

export enum PackageType {
	SINGLE = 'single',
	PACK = 'pack',
	BOX = 'box',
	CASE = 'case',
}
