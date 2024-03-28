import { VariantProps, cva } from 'class-variance-authority';

export const indicatorVariants = cva('w-1.5 h-1.5 rounded-full', {
	variants: {
		color: {
			default: 'bg-blue-700',
			red: 'bg-red-500',
			blue: 'bg-blue-500',
			yellow: 'bg-yellow-500',
		},
	},
	defaultVariants: {
		color: 'default',
	},
});

const indicatorBackgroundVariants = cva('flex-none rounded-full p-1', {
	variants: {
		color: {
			default: 'bg-blue-700/20 animate-pulse',
			red: 'bg-red-500/20 animate-pulse',
			blue: 'bg-blue-500/20 animate-pulse',
			yellow: 'bg-yellow-500/20 animate-pulse',
		},
	},
	defaultVariants: {
		color: 'default',
	},
});

interface IndicatorProps extends VariantProps<typeof indicatorVariants> {}

export default function Indicator({ color }: IndicatorProps) {
	return (
		<div className={indicatorBackgroundVariants({ color })}>
			<div className={indicatorVariants({ color })} />
		</div>
	);
}
