'use client';

import { useSearchParams } from 'next/navigation';
import { createContext, useContext } from 'react';

const SearchContext = createContext<string>('');

export function SearchProvider({ children }: { children: React.ReactNode }) {
	const searchParams = useSearchParams();
	const search = searchParams.get('q') || '';

	return (
		<SearchContext.Provider value={search}>{children}</SearchContext.Provider>
	);
}

export function useSearch() {
	return useContext(SearchContext);
}
