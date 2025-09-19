import { API_URL } from './index';
import type { User, CommonReadsResponse, JoinResponse, LonelyBooksResponse } from '../types/models';

export type RankedUser = User & {
	rank: number;
	readCount: number;
};

export const getLeaderboard = async (period: string = 'all'): Promise<RankedUser[]> => {
	const params = new URLSearchParams();
	if (period !== 'all') {
		params.append('period', period);
	}

	const response = await fetch(`${API_URL}/users/leaderboard?${params}`);
	return response.json();
};

export const getCommonReads = async (userId: number): Promise<CommonReadsResponse> => {
	const response = await fetch(`${API_URL}/users/${userId}/common_reads`);
	if (!response.ok) {
		throw new Error('共読データの取得に失敗しました');
	}
	return response.json();
};

export const getLonelyBooks = async (userId: number): Promise<LonelyBooksResponse> => {
	const response = await fetch(`${API_URL}/users/${userId}/lonely_books`);
	if (!response.ok) {
		throw new Error('ひとりぼっち本データの取得に失敗しました');
	}
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
