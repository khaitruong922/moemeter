import { API_URL } from './index';
import type { Book, BooksApiResponse } from '../types/models';
import type { SortOrder } from '../types/queryParams';

type BooksQueryParams = {
	page: number;
	query?: string | null;
	field?: string | null;
	period?: string | null;
	userId?: number | null;
	lonely?: boolean | null;
	dateOrder?: SortOrder;
};

export const getBooks = async (params: BooksQueryParams): Promise<BooksApiResponse> => {
	const { page, query, field, period, userId, lonely, dateOrder } = params;
	const searchParams = new URLSearchParams({
		page: page.toString(),
	});

	if (query) {
		searchParams.append('q', query);
		if (field) {
			searchParams.append('field', field);
		}
	}

	if (period) {
		searchParams.append('period', period);
	}

	if (userId) {
		searchParams.append('user_id', userId.toString());
	}

	if (lonely) {
		searchParams.append('lonely', 'true');
	}

	if (dateOrder) {
		searchParams.append('date_order', dateOrder);
	}

	const response = await fetch(`${API_URL}/books?${searchParams}`);
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
