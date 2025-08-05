export interface Review {
	id: number;
	book_id: number;
	user_id: number;
	user_name: string | null;
	user_avatar_url: string | null;
	content: string | null;
	is_spoiler: boolean | null;
	nice_count: number | null;
	created_at: string | null;
}

export interface Book {
	id: number;
	title: string;
	author: string;
	author_url: string;
	thumbnail_url: string;
	user_ids: number[];
	reviews: Review[];
}

export interface User {
	id: number;
	name: string;
	avatar_url: string;
	books_read: number;
	pages_read: number;
	book_ids: number[];
}

export interface Read {
	user_id: number;
	book_id: number;
}

export interface CommonReadsResponse {
	books: { [key: string]: Book };
	users: { [key: string]: User };
}

export interface JoinResponse {
	user: User;
	message: string;
}

export interface PageInfo {
	currentPage: number;
	prevPage: number | null;
	nextPage: number | null;
	lastPage: number;
}

export interface PaginatedResponse<T> {
	count: number;
	total_count: number;
	pageInfo: PageInfo;
	books: T[];
}

export interface BooksApiResponse extends Omit<PaginatedResponse<Book>, 'books'> {
	books: Book[];
	users: { [key: string]: User };
}
