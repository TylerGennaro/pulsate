import { cn } from '@lib/utils';
import {
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	Pagination as ShadPagination,
} from './ui/pagination';

type PaginationProps = {
	total: number;
	page: number;
	perPage: number;
	onChange: (page: number) => void;
	className?: string;
};

export default function Pagination({
	total,
	page,
	perPage,
	onChange,
	className,
}: PaginationProps) {
	const totalPages = Math.ceil(total / perPage);

	let numberStart, numberEnd;

	if (page <= 3) {
		numberStart = 0;
		numberEnd = 5;
	} else if (page >= 9) {
		numberStart = 5;
		numberEnd = 10;
	} else {
		numberStart = page - 3;
		numberEnd = page + 2;
	}

	return (
		<ShadPagination className={cn('list-none', className)}>
			<PaginationContent>
				<PaginationPrevious
					disabled={page === 1}
					onClick={() => onChange(Math.max(page - 1, 1))}
				/>
				{Array.from({ length: totalPages }, (_, i) => i + 1)
					.slice(numberStart, numberEnd)
					.map((i) => (
						<PaginationItem key={i} onClick={() => onChange(i)}>
							<PaginationLink isActive={i === page}>{i}</PaginationLink>
						</PaginationItem>
					))}
				<PaginationNext
					disabled={page === totalPages}
					onClick={() => onChange(Math.min(page + 1, totalPages))}
				/>
			</PaginationContent>
		</ShadPagination>
	);
}
