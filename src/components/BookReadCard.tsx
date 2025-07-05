import type { Book, User } from '../types/models';
import { getBookBookmeterUrl } from '../utils/bookmeter';
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
		<div className="p-4 bg-white rounded-lg shadow">
			<div className="flex items-start space-x-4">
				<div className="flex-none w-12 sm:w-16 text-center">
					<div className={`text-lg sm:text-2xl font-bold bookmeter-green-text`}>#{index}</div>
					<div className="text-xs sm:text-sm text-gray-500">{readCount}人</div>
				</div>
				<div className="flex-shrink-0">
					<BookCover bookId={book.id} title={book.title} thumbnailUrl={book.thumbnail_url} />
				</div>
				<div className="flex-grow flex flex-col">
					<a
						href={getBookBookmeterUrl(book.id)}
						target="_blank"
						rel="noopener noreferrer"
						className="bookmeter-green-text font-bold text-base mb-1 text-left"
					>
						{book.title}
					</a>
					<a
						href={book.author_url}
						target="_blank"
						rel="noopener noreferrer"
						className="bookmeter-green-text text-sm block text-left"
					>
						{book.author}
					</a>
					<div className="mt-2 mb-4">
						<UserAvatarGroup users={commonUsers} />
					</div>
				</div>
			</div>
		</div>
	);
};
