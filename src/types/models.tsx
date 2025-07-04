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

export interface Read {
	user_id: number;
	book_id: number;
}

export interface CommonReadsResponse {
	reads: Read[];
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
