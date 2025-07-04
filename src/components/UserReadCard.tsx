import type { Book, User } from '../types/models';
import { UserAvatar } from './UserAvatar';
import { BookCover } from './BookCover';
import { getUserBookmeterUrl } from '../utils/bookmeter';

interface UserReadCardProps {
	user: User;
	readCount: number;
	commonBooks: Book[];
}

export const UserReadCard: React.FC<UserReadCardProps> = ({ user, readCount, commonBooks }) => {
	return (
		<div className="p-2 sm:p-4 bg-white rounded-lg shadow">
			<div className="flex items-center space-x-2 sm:space-x-4 mb-2 sm:mb-4">
				<UserAvatar userId={user.id} name={user.name} avatarUrl={user.avatar_url} size="sm" />
				<div className="flex-grow flex flex-col items-start">
					<a href={getUserBookmeterUrl(user.id)} target="_blank" rel="noopener noreferrer">
						<h3 className="text-base sm:text-lg font-semibold bookmeter-green-text">{user.name}</h3>
					</a>
					<p className="text-xs sm:text-sm text-gray-600">
						共読数: <span className="font-bold bookmeter-green-text">{readCount}冊</span>
					</p>
				</div>
			</div>
			<div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-4">
				{commonBooks.map((book) => (
					<BookCover
						key={book.id}
						bookId={book.id}
						title={book.title}
						thumbnailUrl={book.thumbnail_url}
						size="sm"
					/>
				))}
			</div>
		</div>
	);
};
