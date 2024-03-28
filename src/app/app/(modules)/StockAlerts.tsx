import TagBadge from '@components/TagBadge';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@components/ui/accordion';
import { Tag } from '@lib/enum';
import { ChevronRight } from 'lucide-react';

export default function StockAlerts() {
	return (
		<Accordion
			type='single'
			collapsible
			className='mt-4 border-t rounded-md border-x bg-background'
		>
			<AccordionItem value='1' className='overflow-hidden rounded-md'>
				<AccordionTrigger className='px-4 [&[data-state=open]]:border-b bg-content brightness-75'>
					Test Location
				</AccordionTrigger>
				<AccordionContent className='pb-0 bg-content'>
					<ul>
						<li className='flex items-center justify-between px-4 py-4 transition-colors cursor-pointer hover:bg-muted'>
							<span>Cervical Collar</span>
							<div className='flex items-center gap-8'>
								<div className='flex gap-2'>
									<TagBadge tag={Tag.LOW} />
								</div>
								<ChevronRight size={16} />
							</div>
						</li>
						<li className='flex items-center justify-between px-4 py-4 transition-colors cursor-pointer hover:bg-muted'>
							<span>Cervical Collar</span>
							<div className='flex items-center gap-8'>
								<div className='flex gap-2'>
									<TagBadge tag={Tag.LOW} />
								</div>
								<ChevronRight size={16} />
							</div>
						</li>
						<li className='flex items-center justify-between px-4 py-4 transition-colors cursor-pointer hover:bg-muted'>
							<span>Cervical Collar</span>
							<div className='flex items-center gap-8'>
								<div className='flex gap-2'>
									<TagBadge tag={Tag.LOW} />
									<TagBadge tag={Tag.EXPIRES} />
								</div>
								<ChevronRight size={16} />
							</div>
						</li>
					</ul>
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value='2' className='overflow-hidden rounded-md'>
				<AccordionTrigger className='px-4 bg-content brightness-75 [&[data-state=open]]:border-b'>
					Other Location
				</AccordionTrigger>
				<AccordionContent className='pb-0 bg-content'>
					<ul>
						<li className='flex items-center justify-between px-4 py-4 transition-colors cursor-pointer hover:bg-muted'>
							<span>Cervical Collar</span>
							<div className='flex items-center gap-8'>
								<TagBadge tag={Tag.LOW} />
								<ChevronRight size={16} />
							</div>
						</li>
					</ul>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
