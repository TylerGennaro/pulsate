import { Button } from '@components/ui/button';
import Header from '@components/ui/header';
import { Skeleton } from '@components/ui/skeleton';
import { Plus, Trash } from 'lucide-react';
import { ReactNode } from 'react';
import AddUserPermissionDialog from './AddUserPermissionDialog';
import InformationSettings from './InformationSettings';
import ArrowButton from '@components/ArrowButton';
import { cn } from '@lib/utils';
import DeleteLocationDialog from './DeleteLocationDialog';

function Section({
	children,
	hasDivider,
}: {
	children: ReactNode;
	hasDivider?: boolean;
}) {
	return (
		<div className='mb-6'>
			{children}
			{hasDivider && <hr className='mt-12 mb-12' />}
		</div>
	);
}

function SectionTitle({
	title,
	desc,
	children,
	className,
}: {
	title: string;
	desc?: string;
	children?: ReactNode;
	className?: string;
}) {
	return (
		<div className={cn('flex items-center justify-between mb-12', className)}>
			<div className='space-y-2'>
				<Header size='sm' weight='medium'>
					{title}
				</Header>
				{desc && <p className='text-muted-foreground'>{desc}</p>}
			</div>
			{children}
		</div>
	);
}

export default function SettingsPage({ locationId }: { locationId: string }) {
	return (
		<>
			<Section hasDivider>
				<SectionTitle
					title='Information'
					desc='General information about this location.'
				/>
				<InformationSettings locationId={locationId} />
			</Section>
			<Section hasDivider>
				<SectionTitle
					title='Permissions'
					desc='Manage user permissions for this location.'
				>
					<AddUserPermissionDialog>
						<Button variant='flat' size='icon'>
							<Plus />
						</Button>
					</AddUserPermissionDialog>
				</SectionTitle>
				<div className='flex justify-center'>
					{/* <PlusButton>Add user</PlusButton> */}
					<ul className='flex justify-start w-full'>
						<li className='flex items-center gap-4'>
							<Skeleton className='w-12 h-12 rounded-full' />
							<div className='flex flex-col gap-1'>
								<span className='font-medium'>Tyler Gennaro</span>
								<span className='text-sm text-muted-foreground'>
									tylergennaro10@gmail.com
								</span>
							</div>
						</li>
					</ul>
				</div>
			</Section>
			<Section>
				<SectionTitle
					title='Delete Location'
					desc='Pull the plug on this whole operation.'
					className='mb-8'
				/>
				<DeleteLocationDialog locationId={locationId} />
			</Section>
		</>
	);
}