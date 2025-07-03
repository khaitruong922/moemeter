import type { User, CommonReadsResponse } from '../types/models';
import { API_URL } from './index';

export const getLeaderboard = async (): Promise<User[]> => {
	const response = await fetch(`${API_URL}/users/leaderboard`);
	return response.json();
};

export const getCommonReads = async (userId: number): Promise<CommonReadsResponse> => {
	const response = await fetch(`${API_URL}/users/${userId}/common_reads`);
	return response.json();
};
