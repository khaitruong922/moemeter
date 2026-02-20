import { Link } from 'react-router-dom';
import type { Book, User } from '../types/models';
import { UserAvatar } from './UserAvatar';
import { UserReadBookCover } from './UserReadBookCover';

interface UserReadCardProps {
	user: User;
	readCount: number;
	commonBooks: Book[];
	index: number;
}

export const UserReadCard: React.FC<UserReadCardProps> = ({
	user,
	readCount,
	commonBooks,
	index,
}) => {
	return (
		<div className="p-2 sm:p-4 bg-white rounded-lg shadow">
			<div className="flex items-center space-x-2 sm:space-x-4 mb-2 sm:mb-4">
				<div className="flex-none w-12 sm:w-16 text-center">
					<div className={`text-lg sm:text-2xl font-bold bookmeter-green-text`}>#{index}</div>
					<div className="text-xs sm:text-sm text-gray-500">{readCount}冊</div>
				</div>
				<UserAvatar
					userId={user.id}
					name={user.name}
					avatarUrl={user.avatar_url}
					size="md"
					toProfile
				/>
				<div className="flex-grow flex flex-col items-start">
					<Link to={`/profile/${user.id}`}>
						<h3 className="text-base sm:text-lg font-semibold bookmeter-green-text hover:underline">
							{user.name}
						</h3>
					</Link>
				</div>
			</div>
			<div className="flex flex-wrap gap-2 mt-4">
				{commonBooks.map((book) => (
					<UserReadBookCover
						key={book.id}
						bookId={book.id}
						title={book.title}
						thumbnailUrl={book.thumbnail_url}
					/>
				))}
			</div>
		</div>
	);
};
