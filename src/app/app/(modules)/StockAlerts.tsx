import TagBadge from '@components/TagBadge';
import { Constants, Tag } from '@lib/enum';
import { StockAlert } from '../DashboardModules';
import { format } from 'date-fns';
import { dateToUTC, isExpired } from '@lib/date';

export default function StockAlerts({ data }: { data: StockAlert[] }) {
	return (
		<ul className='mt-8'>
			{data.map((item) => {
				const expDate =
					'expires' in item
						? dateToUTC(new Date(item.expires)) ?? new Date()
						: new Date();
				return (
					<li
						key={item.name}
						className='py-2 border-b last-of-type:border-none'
					>
						<a className='flex items-center justify-between p-2 transition-colors rounded-md hover:bg-muted'>
							<div className='flex items-center gap-8'>
								<div>
									<TagBadge
										tag={
											'quantity' in item
												? Tag.LOW
												: isExpired(expDate) === Constants.IS_EXPIRED
												? Tag.EXPIRED
												: Tag.EXPIRES
										}
									/>
								</div>
								<div>
									<p>{item.name}</p>
									<p className='text-sm text-muted-foreground'>
										{item.location}
									</p>
								</div>
							</div>
							<p className='text-muted-foreground'>
								{'quantity' in item
									? `${item.quantity <= 0 ? 'No' : item.quantity} items left`
									: `Expires ${format(expDate, 'MMM d, yyyy')}`}
							</p>
						</a>
					</li>
				);
			})}
		</ul>
	);
}
