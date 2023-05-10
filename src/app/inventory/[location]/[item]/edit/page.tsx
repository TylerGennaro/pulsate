import Header from '@components/ui/Header';
import { cn } from '@lib/utils';
import EditInventory from './EditInventory';

function Section({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn(className, 'flex flex-col items-center')}>
			{children}
		</div>
	);
}

export default function Page() {
	return (
		<div className='py-12 flex flex-col gap-8'>
			<Section>
				<Header size='lg'>Station 154</Header>
				<span className='text-md text-muted-foreground mt-2'>
					Check items in or out of inventory
				</span>
			</Section>
			<Section>
				<Header size='xl' className='text-center'>
					Cervical Collar
				</Header>
			</Section>
			<Section>
				<span className='block text-muted-foreground'>Current quantity:</span>
				<span className='text-5xl font-bold'>8</span>
			</Section>
			<Section className='flex flex-col gap-4'>
				<EditInventory name='Cervical Collar' />
			</Section>
		</div>
	);
}
