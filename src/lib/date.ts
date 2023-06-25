import { format } from 'date-fns';

export function toDateTime(seconds: number | null) {
	if (seconds === null) return null;
	return new Date(seconds * 1000);
}

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

export function timeSince(date: Date) {
	const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
	let interval = Math.floor(seconds / 31536000);
	if (interval >= 1) return interval + 'y';
	interval = Math.floor(seconds / 2592000);
	if (interval >= 1) return interval + 'm';
	interval = Math.floor(seconds / 86400);
	if (interval >= 1) return interval + 'd';
	interval = Math.floor(seconds / 3600);
	if (interval >= 1) return interval + 'h';
	interval = Math.floor(seconds / 60);
	if (interval >= 1) return interval + 'm';
	return Math.floor(seconds) + 's';
}
