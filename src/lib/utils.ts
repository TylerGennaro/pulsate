import { ClassValue, clsx } from 'clsx';
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
	notify = true,
}: {
	method: string;
	url: string;
	data?: object;
	notify?: boolean;
}) {
	const result = await fetch(`/api${url}`, {
		method: method,
		body: data ? JSON.stringify(data) : '',
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(async (res) => {
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

export function catchError(e: any) {
	if (e instanceof z.ZodError) {
		console.log(e);
		return new NextResponse(
			e.issues[0]?.message || 'Invalid request. Try again.',
			{
				status: 400,
			}
		);
	}
	return new NextResponse('Could not complete request.', {
		status: 500,
	});
}
