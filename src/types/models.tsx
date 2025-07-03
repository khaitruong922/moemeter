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
