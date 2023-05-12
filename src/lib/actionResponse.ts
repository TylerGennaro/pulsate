import toast from 'react-hot-toast';

export function handleResponse(res: { status: number; message: string }) {
	res.status === 200 ? toast.success(res.message) : toast.error(res.message);
}
