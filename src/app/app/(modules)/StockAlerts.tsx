import TagBadge from '@components/TagBadge';
import { Tag } from '@lib/enum';

const data = [
	{
		name: 'Cervical Collar',
		location: 'Test Location',
		quantity: 4,
		tag: Tag.LOW,
	},
	{
		name: 'Test Item',
		location: 'Test Location',
		expires: 'Mar 30, 2024',
		tag: Tag.EXPIRES,
	},
	{
		name: 'Cervical Collar2',
		location: 'Other Location',
		quantity: 4,
		tag: Tag.LOW,
	},
];

export default function StockAlerts() {
	return (
		<ul className='mt-8'>
			{data.map((item) => (
				<li
					key={item.name}
					className='transition-colors border-b last-of-type:border-none hover:bg-muted'
				>
					<a className='flex items-center justify-between p-2'>
						<div className='flex items-center gap-8'>
							<div>
								<TagBadge tag={item.tag} />
							</div>
							<div>
								<p>{item.name}</p>
								<p className='text-sm text-muted-foreground'>{item.location}</p>
							</div>
						</div>
						<p className='text-muted-foreground'>
							{item.quantity
								? `${item.quantity} items left`
								: `Expires ${item.expires}`}
						</p>
					</a>
				</li>
			))}
		</ul>
	);
}
