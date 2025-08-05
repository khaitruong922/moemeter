import type { Book, User } from '../types/models';
import { BookCardBase } from './BookCardBase';

interface BookReadCardProps {
	book: Book;
	readCount: number;
	commonUsers: User[];
	index: number;
}

export const BookReadCard: React.FC<BookReadCardProps> = ({
	book,
	readCount,
	commonUsers,
	index,
}) => {
	return (
		<BookCardBase
			book={book}
			index={index}
			userCount={readCount}
			avatarUsers={commonUsers}
			isRead={true}
			showCheck={false}
			reviewIsRead={true}
		/>
	);
};
