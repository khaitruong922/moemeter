import { BookCardBase } from './BookCardBase';
import type { Book, User } from '../types/models';

// BookCard wrapper
interface Props {
	book: Book;
	index: number;
	users: { [key: string]: User };
	currentUserId?: number;
}

export const BookCard: React.FC<Props> = ({ book, index, users, currentUserId }) => {
	const bookUsers = book.user_ids.map((id) => users[id]).filter(Boolean);
	const isRead = currentUserId ? book.user_ids.includes(currentUserId) : false;
	return (
		<BookCardBase
			book={book}
			index={index}
			userCount={book.user_ids.length}
			avatarUsers={bookUsers}
			isRead={isRead}
			showCheck={true}
			reviewIsRead={isRead}
		/>
	);
};
