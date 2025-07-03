import { useQuery } from '@tanstack/react-query';
import { getBooks } from '../api/books';
import { BookList } from '../components/BookList';
import { getGroups } from '../api/groups';

const BooksPage = () => {
	const {
		data: booksData,
		isLoading: isBooksLoading,
		error: booksError,
	} = useQuery({
		queryKey: ['books'],
		queryFn: getBooks,
	});
	const { data: groupsData } = useQuery({
		queryKey: ['groups'],
		queryFn: getGroups,
	});

	const groupName = groupsData?.[0]?.name || 'グループ';
	const books = booksData || [];

	if (isBooksLoading) {
		return (
			<div className="flex justify-center items-center min-h-[70vh]">
				<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	if (booksError) {
		return (
			<div className="flex justify-center items-center min-h-[70vh]">
				<div className="text-red-600 bg-red-50 p-4 rounded-lg">
					<p className="font-medium">エラーが発生しました</p>
					<p className="text-sm mt-1">
						{booksError instanceof Error ? booksError.message : '本の一覧を取得できませんでした'}
					</p>
				</div>
			</div>
		);
	}

	if (!booksData || books.length === 0) {
		return (
			<div className="flex flex-col items-center min-h-[70vh] w-full pt-10">
				<div className="mb-8 text-center">
					<h2 className="text-2xl font-bold text-gray-800 mb-2">本一覧</h2>
					<p className="text-base text-gray-600">{groupName}のユーザーが読んでいる本の一覧です。</p>
				</div>
				<div className="text-gray-600 bg-gray-50 p-4 rounded-lg">まだ本が登録されていません</div>
			</div>
		);
	}

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
