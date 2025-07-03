import { createContext, useContext } from 'react';
import type { User } from '../types/models';

export interface UserContextType {
	user: User | null;
	setUser: (user: User | null) => void;
	logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error('useUser must be used within a UserProvider');
	}
	return context;
}
