import type { Book } from '../types/models';
import { API_URL } from './index';

export const getBooks = async (): Promise<Book[]> => {
	const response = await fetch(`${API_URL}/books`);
	return response.json();
};
