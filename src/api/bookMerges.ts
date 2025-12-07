import { API_URL } from '.';
import type { Book } from '../types/models';

export interface BookMerge {
	base: Book;
	variants: Book[];
}

export const getBookMerges = async (): Promise<BookMerge[]> => {
	const response = await fetch(`${API_URL}/book_merges`);
	if (!response.ok) {
		throw new Error('Failed to fetch book merges');
	}
	return response.json();
};
