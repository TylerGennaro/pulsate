'use client';

import { cn } from '@lib/utils';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import LogoSvg from './LogoSvg';

export default function Logo({ className }: { className?: string }) {
	const { theme } = useTheme();
	return (
		<Link href='/' className={cn('items-center gap-2 flex', className)}>
			<div className='w-8 h-8'>
				<LogoSvg />
			</div>
			<span className='text-2xl font-medium text-primary'>Pulsate</span>
		</Link>
	);
}
