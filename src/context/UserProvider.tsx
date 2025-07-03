import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEY } from '../constants';
import { UserContext, type UserContextType } from './userContext';
import type { User } from '../types/models';

export function UserProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(() => {
		const savedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
		return savedUser ? JSON.parse(savedUser) : null;
	});

	useEffect(() => {
		if (user) {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
		} else {
			localStorage.removeItem(LOCAL_STORAGE_KEY);
		}
	}, [user]);

	const logout = () => {
		setUser(null);
	};

	const value: UserContextType = {
		user,
		setUser,
		logout,
	};

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
