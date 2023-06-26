import { cn } from '@lib/utils';
import { Loader2 } from 'lucide-react';

export default function Loader({ className }: { className?: string }) {
	return <Loader2 className={cn('animate-spin w-16 h-16', className)} />;
}
