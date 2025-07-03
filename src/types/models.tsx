export interface User {
	id: number;
	name: string;
	avatar_url: string;
	profile_url: string;
	books_read: number;
	pages_read: number;
}

export interface Book {
	id: number;
	title: string;
	author: string;
	author_url: string;
	thumbnail_url: string;
	read_count: number;
	user_ids: number[];
}

export interface CommonRead {
	user_id: number;
	book_id: number;
	date: string;
}

export interface CommonReadsResponse {
	reads: CommonRead[];
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

export interface BooksResponse extends PaginatedResponse<Book> {}

export interface BooksApiResponse extends Omit<PaginatedResponse<Book>, 'books'> {
	books: Book[];
	users: { [key: string]: User };
}
