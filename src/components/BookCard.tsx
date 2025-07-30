import type { Book, User } from '../types/models';
import { getBookBookmeterUrl } from '../utils/bookmeter';
import { BookCover } from './BookCover';
import { UserAvatarGroup } from './UserAvatarGroup';

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
		<div
			className={`flex items-start gap-2 sm:gap-4 p-2 sm:p-4 transition-colors duration-200 ${isRead ? 'bg-[#f0fae8] hover:bg-[#e6f7d9]' : 'hover:bg-gray-50'}`}
		>
			<div className="flex-none w-12 sm:w-16 text-center">
				<div className={`text-lg sm:text-2xl font-bold bookmeter-green-text`}>#{index}</div>
				<div className="text-xs sm:text-sm text-gray-500">{book.user_ids.length}人</div>
			</div>
			<div className="flex-none">
				<BookCover bookId={book.id} title={book.title} thumbnailUrl={book.thumbnail_url} />
			</div>
			<div className="flex-1 min-w-0 flex flex-col">
				<a
					href={getBookBookmeterUrl(book.id)}
					target="_blank"
					rel="noopener noreferrer"
					className="text-base sm:text-lg bookmeter-green-text font-bold mb-1 line-clamp-2 text-left"
				>
					{book.title}
				</a>
				<a
					href={book.author_url}
					target="_blank"
					rel="noopener noreferrer"
					className="text-xs sm:text-sm bookmeter-green-text text-left"
				>
					{book.author}
				</a>
				<div className="mt-1 sm:mt-2">
					<UserAvatarGroup users={bookUsers} size="sm" />
				</div>
			</div>
		</div>
	);
};
