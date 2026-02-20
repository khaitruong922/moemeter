import type { Book, User } from '../types/models';
import { BookCard } from './BookCard';

interface Props {
	books: Book[];
	users: { [key: string]: User };
	currentUserId?: number;
	fullWidth?: boolean;
}

export const BookList: React.FC<Props> = ({ books, users, currentUserId, fullWidth = false }) => {
	return (
		<div className={`w-full divide-y divide-gray-200 ${fullWidth ? '' : 'max-w-4xl mx-auto'}`}>
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
