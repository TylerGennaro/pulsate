import { ClassValue, clsx } from 'clsx';
import { format } from 'date-fns';
import { NextResponse } from 'next/server';
import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formDataToObject(formData: FormData) {
	const object: Record<string, any> = {};
	formData.forEach((value, key) => {
		object[key] = value;
	});
	return object;
}

export async function crud({
	method,
	url,
	data,
	params,
	notify = true,
}: {
	method: string;
	url: string;
	data?: object;
	params?: { [key: string]: string };
	notify?: boolean;
}) {
	const paramString = new URLSearchParams(params).toString();
	const result = await fetch(
		`/api${url}${paramString ? '?' + paramString : ''}`,
		{
			method: method,
			body: data ? JSON.stringify(data) : '',
			headers: {
				'Content-Type': 'application/json',
			},
		}
	).then(async (res) => {
		if (res.redirected) {
			window.location.replace(res.url);
			return { message: 'Redirecting...', status: 200, redirected: true };
		}
		return { message: await res.text(), status: res.status };
	});

	if (notify && !result.redirected)
		if (result.status === 200) toast.success(result.message);
		else toast.error(result.message);

	return result;
}

export async function fetchJSONPost(url: string, data?: object) {
	const response = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	return { data: await response.json(), status: response.status };
}

export function catchError(e: any) {
	if (e instanceof z.ZodError) {
		return new NextResponse(
			e.issues[0]?.message || 'Invalid request. Try again.',
			{
				status: 400,
			}
		);
	}
	return new NextResponse(
		`Could not complete request${e.message ? `: ${e.message}.` : '.'}`,
		{
			status: 500,
		}
	);
}

export function formatExpirationDate(date: Date | null) {
	if (date === null) return 'Never';
	return format(date, 'MMM d, yyyy');
}
