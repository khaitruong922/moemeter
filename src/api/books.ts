import { API_URL } from './index';
import type { Book, BooksApiResponse } from '../types/models';

export const getBooks = async (
	page: number,
	query = '',
	field = 'all',
	period = 'all',
	userId?: number,
	lonely?: boolean,
	dateOrder?: 'ASC' | 'DESC'
): Promise<BooksApiResponse> => {
	const params = new URLSearchParams({
		page: page.toString(),
	});

	if (query) {
		params.append('q', query);
		if (field !== 'all') {
			params.append('field', field);
		}
	}

	if (period !== 'all') {
		params.append('period', period);
	}

	if (userId) {
		params.append('user_id', userId.toString());
	}

	if (lonely) {
		params.append('lonely', 'true');
	}

	if (dateOrder) {
		params.append('date_order', dateOrder);
	}

	const response = await fetch(`${API_URL}/books?${params}`);
	if (!response.ok) {
		throw new Error('本の一覧を取得できませんでした');
	}

	return response.json();
};

export interface BooksLibraryApiResponse {
	books: Book[];
	total_count: number;
	max_page: number;
}

export const getBooksLibrary = async (
	page: number,
	perPage = 50
): Promise<BooksLibraryApiResponse> => {
	const params = new URLSearchParams({
		page: page.toString(),
		per_page: perPage.toString(),
	});

	const response = await fetch(`${API_URL}/books/library?${params}`);
	if (!response.ok) {
		throw new Error('本の一覧を取得できませんでした');
	}

	return response.json();
};
