type LoaderSvgProps = {
	faded?: boolean;
};

export default function LoaderSvg({ faded = false }: LoaderSvgProps) {
	return (
		<svg
			className='[stroke-dashoffset:250] [stroke-dasharray:250] [stroke-linecap:round] animate-[draw-in-out_1500ms_ease-in-out_infinite,_spin_1500ms_linear_infinite]'
			fill='none'
			viewBox='0 0 100 100'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M91 50C91 72.6437 72.6437 91 50 91C27.3563 91 9 72.6437 9 50C9 27.3563 27.3563 9 50 9C72.6437 9 91 27.3563 91 50Z'
				className={faded ? 'stroke-white' : 'stroke-primary'}
				strokeWidth={12}
			/>
		</svg>
	);
}
