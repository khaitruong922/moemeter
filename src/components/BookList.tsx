import type { Book, User } from '../types/models';
import { BookCard } from './BookCard';

interface Props {
	books: Book[];
	users: { [key: string]: User };
	currentUserId?: number;
}

export const BookList: React.FC<Props> = ({ books, users, currentUserId }) => {
	return (
		<div className="w-full max-w-4xl mx-auto bg-white divide-y divide-gray-200">
			{books.map((book, i) => (
				<BookCard
					key={book.id}
					book={book}
					index={i + 1}
					users={users}
					currentUserId={currentUserId}
				/>
			))}
		</div>
	);
};
