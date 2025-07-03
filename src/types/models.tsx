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
