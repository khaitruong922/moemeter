import { createContext } from 'react';
import type { User } from '../types/models';

export type UserContextType = {
	user: User | null;
	setUser: (user: User | null) => void;
	logout: () => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);
