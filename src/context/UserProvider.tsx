import React, { useEffect, useState } from 'react';
import { getUser } from '../api/users';
import { LOCAL_STORAGE_KEY } from '../constants';
import type { User } from '../types/models';
import { UserContext } from './userContext';

type LocalStorageUser = User & { expiry: number };

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUserState] = useState<LocalStorageUser | null>(null);
	const [loading, setLoading] = useState(true);

	const getExpiry = () => {
		const duration = 1 * 12 * 60 * 60 * 1000; // 12 hours
		return Date.now() + duration;
	};

	const setUser = (user: User | null) => {
		if (user) {
			const expiry = getExpiry();
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...user, expiry }));
			setUserState({ ...user, expiry });
		} else {
			localStorage.removeItem(LOCAL_STORAGE_KEY);
			setUserState(null);
		}
	};

	useEffect(() => {
		const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (!saved) {
			setLoading(false);
			return;
		}
		try {
			const { user: savedUser, expiry } = JSON.parse(saved);
			if (expiry && Date.now() < expiry) {
				setUserState(savedUser);
				setLoading(false);
			} else {
				getUser(savedUser.id)
					.then((freshUser) => {
						setUser(freshUser);
						setLoading(false);
					})
					.catch(() => {
						setUser(null);
						setLoading(false);
					});
			}
		} catch {
			setUser(null);
			setLoading(false);
		}
	}, []);

	const logout = () => {
		setUser(null);
	};

	if (loading) return null;

	return <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>;
};
