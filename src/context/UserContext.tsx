import React, { createContext, useEffect, useState } from 'react';
import { LOCAL_STORAGE_KEY } from '../constants';
import type { User } from '../types/models';

interface UserContextType {
	user: User | null;
	setUser: (user: User | null) => void;
	logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

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

	return <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>;
}
