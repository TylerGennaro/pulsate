import { format } from 'date-fns';
import {} from 'date-fns/locale';

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

export function formatDateTime(date: Date | string) {
	if (typeof date === 'string') {
		if (date.length === 0) return '';
		date = new Date(date);
	}
	return format(date, 'MMM d, yyyy hh:mm a');
}

export function getUTCDate() {
	return new Date(
		Date.UTC(
			new Date().getFullYear(),
			new Date().getMonth(),
			new Date().getDate()
		)
	);
}

export function getUTCDateTime() {
	return new Date(
		Date.UTC(
			new Date().getFullYear(),
			new Date().getMonth(),
			new Date().getDate(),
			new Date().getHours(),
			new Date().getMinutes(),
			new Date().getSeconds(),
			new Date().getMilliseconds()
		)
	);
}

export function formatUTCDate(date: Date | string | null) {
	if (date === null) return null;
	if (typeof date === 'string' && date.length === 0) return '';
	date = new Date(date);
	date.setHours(date.getHours() + date.getTimezoneOffset() / 60);
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
	return diff <= 1000 * 60 * 60 * 24 * 7;
}

export function timeSince(date: Date) {
	const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
	let interval = Math.floor(seconds / 31536000);
	if (interval >= 1) return interval + 'y';
	interval = Math.floor(seconds / 2592000);
	if (interval >= 1) return interval + 'mo';
	interval = Math.floor(seconds / 86400);
	if (interval >= 1) return interval + 'd';
	interval = Math.floor(seconds / 3600);
	if (interval >= 1) return interval + 'h';
	interval = Math.floor(seconds / 60);
	if (interval >= 1) return interval + 'm';
	return Math.floor(seconds) + 's';
}
