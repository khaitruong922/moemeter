import type { Book } from '../types/models';
import { BookCard } from './BookCard';

interface Props {
	books: Book[];
}

export const BookList: React.FC<Props> = ({ books }) => {
	return (
		<div className="w-full max-w-3xl mx-auto bg-white divide-y divide-gray-200">
			{books.map((book, i) => (
				<BookCard key={book.id} book={book} index={i + 1} />
			))}
		</div>
	);
};
