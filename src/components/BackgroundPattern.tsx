export const Patterns = {
	DotGrid,
};

function DotGrid({ className }: { className?: string }) {
	return (
		<div className={className}>
			<svg xmlns='http://www.w3.org/2000/svg'>
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
							x2='0%'
							y2='100%'
						>
							<stop stop-color='white' offset='0' />
							<stop stop-color='black' stop-opacity='0' offset='1' />
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
							className='stroke-none fill-zinc-50'
						/>
					</pattern>
				</defs>
				<rect
					x='1'
					y='1'
					width='800px'
					height='800px'
					style={{ fill: 'url(#dots)', mask: 'url(#mask)' }}
				/>
			</svg>
		</div>
	);
}
