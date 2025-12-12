export type Review = {
	id: number;
	book_id: number;
	user_id: number;
	user_name: string | null;
	user_avatar_url: string | null;
	content: string | null;
	is_spoiler: boolean | null;
	nice_count: number | null;
	created_at: string | null;
};

export type Book = {
	id: number;
	title: string;
	author: string;
	author_url: string;
	thumbnail_url: string;
	user_ids: number[];
	reviews: Review[];
};

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

export interface LonelyBooksResponse {
	books: Book[];
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
	total_reads_count: number;
}

export interface ProfileSummary {
	total_reads: number;
	total_pages: number;
	rank: number;
	pages_rank: number;
	peak_month: PeakMonth | null;
	best_friend: BestFriend | null;
}

export interface PeakMonth {
	month: number;
	total_pages: number;
	reads: ReadSummary[];
}

export interface ReadSummary {
	read_id: number;
	id: number;
	title: string;
	author: string;
	author_url: string;
	thumbnail_url: string;
	page: number;
	title_cleaned: string;
}

export interface BestFriend {
	user: {
		id: number;
		name: string;
		avatar_url: string;
	};

	total_pages: number;
	reads: ReadSummary[];
}
