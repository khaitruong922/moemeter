import type { User } from '../types/models';
import { API_URL } from './index';

export const getLeaderboard = async (): Promise<User[]> => {
	const response = await fetch(`${API_URL}/users/leaderboard`);
	return response.json();
};
