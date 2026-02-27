import { API_URL } from './index';
import type {
	User,
	CommonReadsResponse,
	JoinResponse,
	LonelyBooksResponse,
	ProfileSummary,
} from '../types/models';

export const getProfileSummary = async (userId: number, year: number): Promise<ProfileSummary> => {
	const response = await fetch(`${API_URL}/users/${userId}/summary/${year}`);
	if (!response.ok) {
		throw new Error('プロフィールまとめデータの取得に失敗しました');
	}
	return response.json();
};

export type RankedUser = User & {
	rank: number;
	pages_rank: number;
};

export const getLeaderboard = async (
	period: string = 'all',
	order: string = 'books'
): Promise<RankedUser[]> => {
	const params = new URLSearchParams();
	if (period !== 'all') {
		params.append('period', period);
	}
	if (order !== 'books') {
		params.append('order', order);
	}

	const response = await fetch(`${API_URL}/users/leaderboard?${params}`);
	return response.json();
};

export type LonelyUser = User & {
	lonely_book_count: number | string;
	lonely_points: number | string;
	null_read_date_count: number | string;
	book_count_rank: number | string;
	points_rank: number | string;
};

export type LonelyOrder = 'days' | 'book_count';

export const getLonelyLeaderboard = async (order: LonelyOrder = 'days'): Promise<LonelyUser[]> => {
	const params = new URLSearchParams();
	params.append('order', order);

	const response = await fetch(`${API_URL}/users/lonely-leaderboard?${params}`);
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

export const getUser = async (userId: number): Promise<RankedUser> => {
	const response = await fetch(`${API_URL}/users/${userId}`);
	if (!response.ok) {
		throw new Error('User not found');
	}
	return response.json();
};
