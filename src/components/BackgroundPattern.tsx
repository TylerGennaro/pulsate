export const Patterns = {
	DotGrid,
};

function DotGrid({ className }: { className?: string }) {
	return (
		<div className={className}>
			<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
				<defs>
					<mask
						id='mask'
						maskUnits='userSpaceOnUse'
						maskContentUnits='userSpaceOnUse'
					>
						<radialGradient
							id='grad'
							gradientUnits='userSpaceOnUse'
							x1='0%'
							y1='0%'
							x2='100%'
							y2='100%'
						>
							<stop stop-color='white' offset='0' />
							<stop stop-color='black' stop-opacity='0' offset='0.8' />
						</radialGradient>
						<rect x='0' y='0' width='100%' height='100%' fill='url(#grad)' />
					</mask>
					<pattern
						id='dots'
						x='10'
						y='10'
						width='20'
						height='20'
						patternUnits='userSpaceOnUse'
					>
						<circle
							cx='10'
							cy='10'
							r='1'
							className='stroke-none dark:fill-zinc-50 fill-zinc-900'
						/>
					</pattern>
				</defs>
				<rect
					x='1'
					y='1'
					width='100%'
					height='100%'
					style={{ fill: 'url(#dots)', mask: 'url(#mask)' }}
				/>
			</svg>
		</div>
	);
}
