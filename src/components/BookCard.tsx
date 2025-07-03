import type { Book } from '../types/models';
import { getBookBookmeterUrl } from '../utils/bookmeter';
import { BookCover } from './BookCover';

interface Props {
	book: Book;
	index: number;
}

export const BookCard: React.FC<Props> = ({ book, index }) => {
	return (
		<div className="flex items-start space-x-6 p-4 border-b border-gray-200">
			<div className="flex-shrink-0 pl-2 flex items-center justify-center text-gray-600 font-medium self-center">
				{index}
			</div>
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
					onClick={(e) => e.stopPropagation()}
					className="text-[#219315] text-sm block text-left"
				>
					{book.author}
				</a>
			</div>
			<div className="flex-shrink-0 text-right self-center">
				<div className="text-[#219315] text-sm flex items-center">
					<span className="font-bold text-base">{book.read_count}</span>
					<span className="ml-1">読了</span>
				</div>
			</div>
		</div>
	);
};
