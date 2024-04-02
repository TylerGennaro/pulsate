import TagBadge from '@components/TagBadge';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@components/ui/accordion';
import { Tag } from '@lib/enum';
import { ChevronRight } from 'lucide-react';

const data = [
	{
		name: 'Test Location',
		items: [
			{
				name: 'Cervical Collar',
				quantity: 4,
				tag: Tag.LOW,
			},
			{
				name: 'Test Item',
				expires: 'Mar 30, 2024',
				tag: Tag.EXPIRES,
			},
		],
	},
	{
		name: 'Other Location',
		items: [
			{
				name: 'Cervical Collar',
				quantity: 4,
				tag: Tag.LOW,
			},
		],
	},
];

export default function StockAlerts() {
	return (
		<ul className='mt-8 overflow-hidden rounded-md [&>li:last-of-type_li:last-of-type]:border-none'>
			{data.map((location) => (
				<li key={location.name}>
					<p className='p-2 border-b bg-background'>{location.name}</p>
					<ul>
						{location.items.map((item) => (
							<li
								key={item.name}
								className='flex items-center justify-between p-2 transition-colors border-b hover:bg-muted'
							>
								<div>
									<p>{item.name}</p>
									<p className='text-sm text-muted-foreground'>
										{item.quantity
											? `${item.quantity} items left`
											: `Expires ${item.expires}`}
									</p>
								</div>
								<div>
									<TagBadge tag={item.tag} />
								</div>
							</li>
						))}
					</ul>
				</li>
			))}
		</ul>
		// <Accordion
		// 	type='single'
		// 	collapsible
		// 	className='mt-4 border-t rounded-md border-x bg-background'
		// >
		// 	<AccordionItem value='1' className='overflow-hidden rounded-md'>
		// 		<AccordionTrigger className='px-4 [&[data-state=open]]:border-b bg-content brightness-75'>
		// 			Test Location
		// 		</AccordionTrigger>
		// 		<AccordionContent className='pb-0 bg-content'>
		// 			<ul>
		// 				<li className='flex items-center justify-between px-4 py-4 transition-colors cursor-pointer hover:bg-muted'>
		// 					<span>Cervical Collar</span>
		// 					<div className='flex items-center gap-8'>
		// 						<div className='flex gap-2'>
		// 							<TagBadge tag={Tag.LOW} />
		// 						</div>
		// 						<ChevronRight size={16} />
		// 					</div>
		// 				</li>
		// 				<li className='flex items-center justify-between px-4 py-4 transition-colors cursor-pointer hover:bg-muted'>
		// 					<span>Cervical Collar</span>
		// 					<div className='flex items-center gap-8'>
		// 						<div className='flex gap-2'>
		// 							<TagBadge tag={Tag.LOW} />
		// 						</div>
		// 						<ChevronRight size={16} />
		// 					</div>
		// 				</li>
		// 				<li className='flex items-center justify-between px-4 py-4 transition-colors cursor-pointer hover:bg-muted'>
		// 					<span>Cervical Collar</span>
		// 					<div className='flex items-center gap-8'>
		// 						<div className='flex gap-2'>
		// 							<TagBadge tag={Tag.LOW} />
		// 							<TagBadge tag={Tag.EXPIRES} />
		// 						</div>
		// 						<ChevronRight size={16} />
		// 					</div>
		// 				</li>
		// 			</ul>
		// 		</AccordionContent>
		// 	</AccordionItem>
		// 	<AccordionItem value='2' className='overflow-hidden rounded-md'>
		// 		<AccordionTrigger className='px-4 bg-content brightness-75 [&[data-state=open]]:border-b'>
		// 			Other Location
		// 		</AccordionTrigger>
		// 		<AccordionContent className='pb-0 bg-content'>
		// 			<ul>
		// 				<li className='flex items-center justify-between px-4 py-4 transition-colors cursor-pointer hover:bg-muted'>
		// 					<span>Cervical Collar</span>
		// 					<div className='flex items-center gap-8'>
		// 						<TagBadge tag={Tag.LOW} />
		// 						<ChevronRight size={16} />
		// 					</div>
		// 				</li>
		// 			</ul>
		// 		</AccordionContent>
		// 	</AccordionItem>
		// </Accordion>
	);
}
