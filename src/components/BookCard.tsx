import type { Book } from '../types/models';
import { getBookBookmeterUrl } from '../utils/bookmeter';

interface Props {
	book: Book;
}

export const BookCard: React.FC<Props> = ({ book }) => {
	console.log(book);
	const bookUrl = getBookBookmeterUrl(book.id);

	return (
		<div className="bg-white rounded-lg shadow-md overflow-visible hover:shadow-lg transition-shadow duration-200">
			<div
				className="cursor-pointer"
				onClick={() => window.open(bookUrl, '_blank', 'noopener,noreferrer')}
			>
				<div className="aspect-[3/4] relative">
					<img src={book.thumbnail_url} alt={book.title} className="w-full h-full object-cover" />
					<div className="absolute -top-3 -right-3 bg-green-600 text-white w-10 h-10 rounded-full flex flex-col items-center justify-center text-xs font-bold shadow-lg">
						<span>{book.read_count}</span>
						<span className="text-[10px] -mt-1">読</span>
					</div>
				</div>
				<div className="p-4">
					<h3 className="text-gray-800 font-medium text-sm line-clamp-2 mb-2">{book.title}</h3>
					<span
						onClick={(e) => {
							e.stopPropagation();
							window.open(book.author_url, '_blank', 'noopener,noreferrer');
						}}
						className="text-gray-600 text-sm hover:text-bookmeter-green cursor-pointer"
					>
						{book.author}
					</span>
				</div>
			</div>
		</div>
	);
};
