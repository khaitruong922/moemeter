import { useQuery } from '@tanstack/react-query';
import { getBooks } from '../api/books';
import { BookCard } from '../components/BookCard';

const BooksPage = () => {
	const { data } = useQuery({ queryKey: ['books'], queryFn: getBooks });
	const books = data || [];

	return (
		<div className="flex flex-col items-center min-h-[70vh] w-full pt-10">
			<div className="mb-8 text-center">
				<h2 className="text-2xl font-bold text-gray-800 mb-2">本一覧</h2>
				<p className="text-base text-gray-600">読書メーターのユーザーが読んでいる本の一覧です。</p>
			</div>
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
					{books.map((book) => (
						<BookCard key={book.id} book={book} />
					))}
				</div>
				<div className="mt-8 text-center text-xs text-gray-400">
					最終更新: {new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
				</div>
			</div>
		</div>
	);
};

export default BooksPage;
