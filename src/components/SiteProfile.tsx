import { getServerSession } from 'next-auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Laptop, LogOut, Moon, Palette, Settings, Sun } from 'lucide-react';
import { DropdownSignOutButton } from './SignButton';
import { DropdownThemeToggle } from './ThemeToggle';

export default async function SiteProfile() {
	const session = await getServerSession();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className='cursor-pointer'>
					<AvatarImage src={session?.user?.image || undefined} />
					<AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-48'>
				<DropdownMenuLabel>
					{session?.user?.name || 'My Account'}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<Settings className='w-4 h-4 mr-2' />
					Settings
				</DropdownMenuItem>
				<DropdownThemeToggle />
				<DropdownSignOutButton />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
