'use client';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { Sun, Moon, Palette, Laptop } from 'lucide-react';
import {
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from './ui/dropdown-menu';

export function ThemeToggle() {
	const { setTheme, theme } = useTheme();

	return (
		<Button
			variant='ghost'
			size='sm'
			onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
		>
			<Sun className='rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
			<Moon className='absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
			<span className='sr-only'>Toggle theme</span>
		</Button>
	);
}

export function DropdownThemeToggle() {
	const { setTheme, theme } = useTheme();

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				<Palette className='w-4 h-4 mr-2' />
				Theme
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent>
				<DropdownMenuItem onClick={() => setTheme('light')}>
					<Sun className='w-4 h-4 mr-2' />
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('dark')}>
					<Moon className='w-4 h-4 mr-2' />
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('system')}>
					<Laptop className='w-4 h-4 mr-2' />
					System
				</DropdownMenuItem>
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
}
