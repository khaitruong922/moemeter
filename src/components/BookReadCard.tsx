import type { Book, User } from '../types/models';
import { getAuthorBookmeterUrl, getBookBookmeterUrl } from '../utils/bookmeter';
import { BookCover } from './BookCover';
import { UserAvatarGroup } from './UserAvatarGroup';

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
		<div className="flex items-start gap-2 sm:gap-4 p-2 sm:p-4 hover:bg-gray-50 transition-colors duration-200">
			<div className="flex-none w-12 sm:w-16 text-center">
				<div className={`text-lg sm:text-2xl font-bold bookmeter-green-text`}>#{index}</div>
				<div className="text-xs sm:text-sm text-gray-500">{readCount}人</div>
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
					href={getAuthorBookmeterUrl(book.author_url)}
					target="_blank"
					rel="noopener noreferrer"
					className="text-xs sm:text-sm bookmeter-green-text text-left"
				>
					{book.author}
				</a>
				<div className="mt-1 sm:mt-2">
					<UserAvatarGroup users={commonUsers} size="sm" />
				</div>
			</div>
		</div>
	);
};
