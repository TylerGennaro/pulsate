type LogoSvgProps = {
	animated?: boolean;
	faded?: boolean;
	strokeWidth?: number;
};

export default function LogoSvg({
	animated = false,
	faded = false,
	strokeWidth = 5,
}: LogoSvgProps) {
	return (
		<svg viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<path
				d='M85.7728 54.9106L52.3111 91.9898C51.0952 93.3367 48.9756 93.3367 47.7597 91.9898L14.2956 54.9106C-16.6505 24.0447 16.8975 -10.7482 47.9856 17.3175C49.1457 18.3657 50.9226 18.3657 52.0827 17.3175C83.0617 -10.6292 116.605 24.1561 85.7728 54.9081V54.9106Z'
				strokeWidth={strokeWidth}
				strokeMiterlimit='10'
				className={`${faded ? 'stroke-white' : 'stroke-primary'} ${
					animated
						? '[stroke-dasharray:292] animate-[draw_3s_infinite] delay-450'
						: ''
				}`}
			/>
			<path
				d='M12 51.9284H29.4986L31.2757 47.5472L39.9259 71L49.5303 26L56.7801 58.1927L63.4127 43.3618L67.1578 51.9284H88'
				strokeWidth={strokeWidth}
				strokeLinejoin='round'
				className={`${faded ? 'stroke-white' : 'stroke-primary'} ${
					animated
						? '[stroke-dasharray:292] animate-[draw-alt_3s_infinite]'
						: ''
				}`}
			/>
		</svg>
	);
}
