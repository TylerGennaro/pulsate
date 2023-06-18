'use client';

interface Props {
	children: React.ReactNode;
	onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function Form({ children, onSubmit }: Props) {
	return (
		<form className='grid gap-4 min-w-fit' onSubmit={onSubmit}>
			{children}
		</form>
	);
}
