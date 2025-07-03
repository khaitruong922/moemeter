import type { User, CommonReadsResponse, JoinResponse } from '../types/models';
import { API_URL } from './index';

export const getLeaderboard = async (): Promise<User[]> => {
	const response = await fetch(`${API_URL}/users/leaderboard`);
	return response.json();
};

export const getCommonReads = async (userId: number): Promise<CommonReadsResponse> => {
	const response = await fetch(`${API_URL}/users/${userId}/common_reads`);
	return response.json();
};

export interface JoinGroupRequest {
	user_id: number;
	group_id: number;
	password: string;
}

export const joinGroup = async (data: JoinGroupRequest): Promise<JoinResponse> => {
	const response = await fetch(`${API_URL}/users/join`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = await response.json();
		if (error.error) throw new Error(error.error);
		throw new Error('エラーが発生しました');
	}

	return response.json();
};

export const getUser = async (userId: number): Promise<User> => {
	const response = await fetch(`${API_URL}/users/${userId}`);
	if (!response.ok) {
		throw new Error('User not found');
	}
	return response.json();
};
