export enum LogType {
	QUANTITY_CHANGE,
	ITEM_ADD,
	ITEM_REMOVE,
	STOCK_ORDER,
}

export enum Tag {
	LOW = 'low',
	EXPIRES = 'expires',
	ONORDER = 'onOrder',
	NONE = 'none',
}

export enum PackageType {
	SINGLE = 'single',
	PACK = 'pack',
	BOX = 'box',
	CASE = 'case',
}
