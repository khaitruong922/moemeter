import type { Book, User } from '../types/models';
import { getBookBookmeterUrl, getUserBookmeterUrl } from '../utils/bookmeter';

interface BookReadCardProps {
	book: Book;
	readCount: number;
	commonUsers: User[];
}

export const BookReadCard: React.FC<BookReadCardProps> = ({ book, readCount, commonUsers }) => {
	return (
		<div className="p-4 bg-white rounded-lg shadow">
			<div className="flex items-start space-x-4">
				<a
					href={getBookBookmeterUrl(book.id)}
					target="_blank"
					rel="noopener noreferrer"
					className="block flex-shrink-0"
				>
					<img
						src={book.thumbnail_url}
						alt={book.title}
						className="w-28 h-40 object-cover rounded shadow-sm"
					/>
				</a>
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
							<a
								key={user.id}
								href={getUserBookmeterUrl(user.id)}
								target="_blank"
								rel="noopener noreferrer"
							>
								<img
									src={user.avatar_url}
									alt={user.name}
									title={user.name}
									className="w-12 h-12 rounded-full"
								/>
							</a>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
