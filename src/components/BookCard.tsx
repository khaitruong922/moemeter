import type { Book, User } from '../types/models';
import { getBookBookmeterUrl } from '../utils/bookmeter';
import { BookCover } from './BookCover';
import { UserAvatarGroup } from './UserAvatarGroup';

interface Props {
	book: Book;
	index: number;
	users: { [key: string]: User };
}

export const BookCard: React.FC<Props> = ({ book, index, users }) => {
	const bookUsers = book.user_ids.map((id) => users[id]).filter(Boolean);

	return (
		<div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors duration-200">
			<div className="flex-none w-16 text-center">
				<div className="text-2xl font-bold bookmeter-green-text">#{index}</div>
				<div className="text-sm text-gray-500">{book.read_count}人</div>
			</div>
			<div className="flex-none">
				<BookCover
					bookId={book.id}
					title={book.title}
					thumbnailUrl={book.thumbnail_url}
					size="sm"
				/>
			</div>
			<div className="flex-1 min-w-0 flex flex-col">
				<a
					href={getBookBookmeterUrl(book.id)}
					target="_blank"
					rel="noopener noreferrer"
					className="text-lg bookmeter-green-text font-bold mb-1 line-clamp-2 text-left"
				>
					{book.title}
				</a>
				<a
					href={book.author_url}
					target="_blank"
					rel="noopener noreferrer"
					className="text-sm bookmeter-green-text text-left"
				>
					{book.author}
				</a>
				<div className="mt-2">
					<UserAvatarGroup users={bookUsers} />
				</div>
			</div>
		</div>
	);
};
