import Header from '@components/ui/header';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Button } from '@components/ui/button';
import { authOptions } from '@lib/auth';
import { LayoutDashboard, Settings, Warehouse } from 'lucide-react';
import { getServerSession } from 'next-auth';

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div>{children}</div>;
}
