import type { Book, User } from '../types/models';
import { BookCover } from './BookCover';
import { UserAvatar } from './UserAvatar';
import { getBookBookmeterUrl } from '../utils/bookmeter';

interface BookReadCardProps {
	book: Book;
	readCount: number;
	commonUsers: User[];
}

export const BookReadCard: React.FC<BookReadCardProps> = ({ book, readCount, commonUsers }) => {
	return (
		<div className="p-4 bg-white rounded-lg shadow">
			<div className="flex items-start space-x-4">
				<div className="flex-shrink-0">
					<BookCover
						bookId={book.id}
						title={book.title}
						thumbnailUrl={book.thumbnail_url}
						size="md"
					/>
				</div>
				<div className="flex-grow flex flex-col">
					<a
						href={getBookBookmeterUrl(book.id)}
						target="_blank"
						rel="noopener noreferrer"
						className="text-[#219315] font-bold text-base mb-1 text-left"
					>
						{book.title}
					</a>
					<a
						href={book.author_url}
						target="_blank"
						rel="noopener noreferrer"
						className="text-[#219315] text-sm block text-left"
					>
						{book.author}
					</a>
					<p className="text-gray-600 text-left mt-2 mb-4">
						共通の読者数: <span className="font-bold bookmeter-green-text">{readCount}人</span>
					</p>
					<div className="flex flex-wrap gap-2">
						{commonUsers.map((user) => (
							<UserAvatar
								key={user.id}
								userId={user.id}
								name={user.name}
								avatarUrl={user.avatar_url}
								size="md"
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
