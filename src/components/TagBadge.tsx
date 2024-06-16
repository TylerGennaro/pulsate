import React from 'react';
import { Tag, Tag as TagEnum } from '@lib/enum';
import { tags } from '@lib/relations';
import { Badge } from './ui/badge';
import { VariantProps } from 'class-variance-authority';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export default function TagBadge({ tag }: { tag: TagEnum }) {
	const tagInfo = tags[tag as Tag];
	return (
		<Tooltip>
			<TooltipTrigger>
				<Badge
					color={tagInfo.color as VariantProps<typeof Badge>['color']}
					variant='ghost'
					className='p-1 w-fit whitespace-nowrap'
				>
					{tagInfo.icon && <tagInfo.icon size={16} />}
				</Badge>
			</TooltipTrigger>
			<TooltipContent>{tagInfo.label}</TooltipContent>
		</Tooltip>
	);
}
