import React from 'react';
import { Tag, Tag as TagEnum } from '@lib/enum';
import { tags } from '@lib/relations';
import { Badge } from './ui/badge';

export default function TagBadge({ tag }: { tag: TagEnum }) {
	const tagInfo = tags[tag as Tag];
	return (
		<Badge color={tagInfo.color} variant='ghost' className='whitespace-nowrap'>
			{tagInfo.icon && <tagInfo.icon className='mr-1 w-3 h-3' />}
			{tagInfo.label}
		</Badge>
	);
}
