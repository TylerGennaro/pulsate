import { Button } from '@components/ui/button';
import Header from '@components/ui/header';
import { Skeleton } from '@components/ui/skeleton';
import { Plus, Trash } from 'lucide-react';
import { ReactNode, Suspense } from 'react';
import AddUserPermissionDialog from './AddUserPermissionDialog';
import InformationSettings from './InformationSettings';
import ArrowButton from '@components/ArrowButton';
import { cn } from '@lib/utils';
import DeleteLocationDialog from './DeleteLocationDialog';
import SharedUserList, { SharedUserListSkeleton } from './SharedUserList';

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
			{hasDivider && <hr className='my-16' />}
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
					<AddUserPermissionDialog locationId={locationId}>
						<Button variant='flat' size='icon'>
							<Plus />
						</Button>
					</AddUserPermissionDialog>
				</SectionTitle>
				<Suspense fallback={<SharedUserListSkeleton />}>
					<SharedUserListSkeleton />
					{/* <SharedUserList locationId={locationId} /> */}
				</Suspense>
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
