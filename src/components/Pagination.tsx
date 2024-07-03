import { cn } from '@lib/utils';
import {
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	Pagination as ShadPagination,
} from './ui/pagination';
import { ReactNode } from 'react';

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

	// This took wayyy too long to figure out...
	// Hmu if you find a better way to do this

	const renderPageNumbers = () => {
		let pages: ReactNode[] = [];

		const createPageButton = (pageNumber: number) => (
			<PaginationItem key={pageNumber} onClick={() => onChange(pageNumber)}>
				<PaginationLink isActive={page === pageNumber} className='min-w-[40px]'>
					{pageNumber}
				</PaginationLink>
			</PaginationItem>
		);

		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(createPageButton(i));
			}
		} else {
			pages.push(createPageButton(1));
			if (page > 3) {
				pages.push(
					<PaginationEllipsis key='start-ellipsis' className='min-w-[40px]' />
				);
			}

			let startPage;
			let endPage;

			if (page <= 3) {
				startPage = 2;
				endPage = 5;
			} else if (page >= totalPages - 2) {
				startPage = totalPages - 4;
				endPage = totalPages - 1;
			} else {
				startPage = page - 1;
				endPage = page + 1;
			}

			for (let i = startPage; i <= endPage; i++) {
				pages.push(createPageButton(i));
			}

			if (page < totalPages - 2) {
				pages.push(
					<PaginationEllipsis key='end-ellipsis' className='min-w-[40px]' />
				);
			}
			pages.push(createPageButton(totalPages));
		}

		return pages;
	};

	return (
		<ShadPagination className={cn('list-none', className)}>
			<PaginationContent>
				<PaginationPrevious
					key='prev'
					disabled={page === 1}
					onClick={() => onChange(Math.max(page - 1, 1))}
				/>
				{renderPageNumbers()}
				<PaginationNext
					key='next'
					disabled={page === totalPages}
					onClick={() => onChange(Math.min(page + 1, totalPages))}
				/>
			</PaginationContent>
		</ShadPagination>
	);
}
