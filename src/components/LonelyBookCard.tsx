import type { Book } from '../types/models';
import { BookCardBase } from './BookCardBase';

interface Props {
	book: Book;
	index: number;
}

export const LonelyBookCard: React.FC<Props> = ({ book, index }) => {
	return (
		<BookCardBase
			book={book}
			index={index}
			userCount={1}
			avatarUsers={[]}
			isRead={true}
			showCheck={false}
			reviewIsRead={true}
			userCountLabel="ひとり"
		/>
	);
};

