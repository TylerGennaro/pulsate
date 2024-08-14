import LogoSvg from '@components/LogoSvg';
import { cn } from '@lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

const loaderVariants = cva('', {
	variants: {
		size: {
			sm: 'w-4 h-4 [&_path]:stroke-[9]',
			md: 'w-8 h-8 [&_path]:stroke-[7]',
			lg: 'w-12 h-12',
			xl: 'w-16 h-16',
		},
	},
	defaultVariants: {
		size: 'lg',
	},
});

type LoaderProps = VariantProps<typeof loaderVariants> & {
	faded?: boolean;
	className?: string;
};

export default function Loader({
	faded,
	className,
	size,
	...props
}: LoaderProps) {
	return (
		<div className={cn(loaderVariants({ size }), className)} {...props}>
			<LogoSvg animated faded={faded} />
		</div>
	);
}
