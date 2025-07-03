import type { Book, User } from '../types/models';
import { getUserBookmeterUrl, getBookBookmeterUrl } from '../utils/bookmeter';

interface UserReadCardProps {
	user: User;
	readCount: number;
	commonBooks: Book[];
}

export const UserReadCard: React.FC<UserReadCardProps> = ({ user, readCount, commonBooks }) => {
	return (
		<div className="p-4 bg-white rounded-lg shadow">
			<div className="flex items-center space-x-4 mb-4">
				<a href={getUserBookmeterUrl(user.id)} target="_blank" rel="noopener noreferrer">
					<img src={user.avatar_url} alt={user.name} className="w-12 h-12 rounded-full" />
				</a>
				<div className="flex-grow flex flex-col items-start">
					<a href={getUserBookmeterUrl(user.id)} target="_blank" rel="noopener noreferrer">
						<h3 className="text-lg font-semibold text-[#219315]">{user.name}</h3>
					</a>
					<p className="text-gray-600">
						共通の読書数: <span className="font-bold bookmeter-green-text">{readCount}冊</span>
					</p>
				</div>
			</div>
			<div className="flex flex-wrap gap-2 mt-4">
				{commonBooks.map((book) => (
					<a
						key={book.id}
						href={getBookBookmeterUrl(book.id)}
						target="_blank"
						rel="noopener noreferrer"
						className="block w-28 h-40 relative group"
					>
						<img
							src={book.thumbnail_url}
							alt={book.title}
							className="w-full h-full object-cover rounded shadow-sm"
							title={book.title}
						/>
					</a>
				))}
			</div>
		</div>
	);
};
