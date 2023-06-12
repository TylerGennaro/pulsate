import Header from './header';

export default function Heading({
	className,
	header,
	description,
}: {
	className?: string;
	header: string;
	description?: string;
}) {
	return (
		<div className={className}>
			<Header size='sm' weight='medium' className='mb-2'>
				{header}
			</Header>
			{description && <span className='text-muted-text'>{description}</span>}
		</div>
	);
}
