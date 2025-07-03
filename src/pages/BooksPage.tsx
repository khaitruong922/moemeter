import { useQuery } from '@tanstack/react-query';
import { getBooks } from '../api/books';
import { BookList } from '../components/BookList';

const BooksPage = () => {
	const { data } = useQuery({ queryKey: ['books'], queryFn: getBooks });
	const books = data || [];
	const groupName = 'TMW Novel Club';

	return (
		<div className="flex flex-col items-center min-h-[70vh] w-full pt-10">
			<div className="mb-8 text-center">
				<h2 className="text-2xl font-bold text-gray-800 mb-2">本一覧</h2>
				<p className="text-base text-gray-600">{groupName}のユーザーが読んでいる本の一覧です。</p>
			</div>
			<div className="w-full px-4">
				<BookList books={books} />
				<div className="mt-8 text-center text-xs text-gray-400">
					最終更新: {new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
				</div>
			</div>
		</div>
	);
};

export default BooksPage;
