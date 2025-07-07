import { API_URL } from './index';
import type { BooksApiResponse } from '../types/models';

export const getBooks = async (
	page: number,
	query = '',
	field = 'all',
	period = 'all'
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

	const response = await fetch(`${API_URL}/books?${params}`);
	if (!response.ok) {
		throw new Error('本の一覧を取得できませんでした');
	}

	return response.json();
};
