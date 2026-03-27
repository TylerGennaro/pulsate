'use client';

import { createContext, useContext, ReactNode } from 'react';

const PermissionsContext = createContext<PermissionSet | undefined>(undefined);

export const PermissionsProvider = ({
	children,
	permissions,
}: {
	children: ReactNode;
	permissions: PermissionSet;
}) => {
	return (
		<PermissionsContext.Provider value={permissions}>
			{children}
		</PermissionsContext.Provider>
	);
};

export const usePermissions = () => {
	const context = useContext(PermissionsContext);
	if (context === undefined) {
		throw new Error('usePermissions must be used within a PermissionsProvider');
	}
	return context;
};
