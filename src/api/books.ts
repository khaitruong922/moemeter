import { API_URL } from './index';
import type { BooksApiResponse } from '../types/models';

export const getBooks = async (page: number = 1): Promise<BooksApiResponse> => {
	const response = await fetch(`${API_URL}/books?page=${page}`);
	return response.json();
};
