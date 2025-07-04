import { API_URL } from './index';
import type { BooksApiResponse } from '../types/models';

export const getBooks = async (page: number = 1, q?: string): Promise<BooksApiResponse> => {
	const params = new URLSearchParams({ page: page.toString() });
	if (q) {
		params.append('q', q);
	}
	const response = await fetch(`${API_URL}/books?${params}`);
	return response.json();
};
