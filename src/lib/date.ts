import { format } from 'date-fns';

export function formatDate(date: Date | string) {
	if (typeof date === 'string') {
		if (date.length === 0) return '';
		date = new Date(date);
	}
	return format(date, 'MMM d, yyyy');
}

export function isExpiring(date: Date | string | null) {
	if (date === null) return false;
	if (typeof date === 'string') {
		if (date.length === 0) return false;
		date = new Date(date);
	}
	const today = new Date();
	const diff = date.getTime() - today.getTime();
	return diff < 1000 * 60 * 60 * 24 * 7;
}
