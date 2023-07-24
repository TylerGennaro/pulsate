import React from 'react';
import { Tag, Tag as TagEnum } from '@lib/enum';
import { tags } from '@lib/relations';
import { Badge } from './ui/badge';
import { VariantProps } from 'class-variance-authority';

export default function TagBadge({ tag }: { tag: TagEnum }) {
	const tagInfo = tags[tag as Tag];
	return (
		<Badge
			color={tagInfo.color as VariantProps<typeof Badge>['color']}
			variant='ghost'
			className='whitespace-nowrap w-fit'
		>
			{tagInfo.icon && <tagInfo.icon className='mr-1 w-3 h-3' />}
			{tagInfo.label}
		</Badge>
	);
}
