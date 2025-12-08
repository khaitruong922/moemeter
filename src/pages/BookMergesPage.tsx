import { useQuery } from '@tanstack/react-query';
import { getBookMerges, type BookMerge } from '../api/bookMerges';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import type { Book } from '../types/models';

const BookCell = ({ book }: { book: Book }) => (
	<div className="flex items-center gap-2 md:gap-3 p-1 md:p-2 rounded">
		<a href={`https://bookmeter.com/books/${book.id}`} target="_blank" rel="noopener noreferrer">
			<img
				src={book.thumbnail_url}
				alt={book.title}
				className="w-12 md:w-20 h-auto object-cover rounded shadow-sm"
			/>
		</a>
		<div className="flex-1 min-w-0">
			<a
				href={`https://bookmeter.com/books/${book.id}`}
				target="_blank"
				rel="noopener noreferrer"
				className="text-xs md:text-sm font-medium text-gray-900 hover:text-[#77b944] line-clamp-2 inline"
			>
				{book.title}
			</a>
			<p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{book.author}</p>
			<p className="text-xs text-gray-400 hidden md:block">ID: {book.id}</p>
		</div>
	</div>
);

const BookMergeRow = ({ merge }: { merge: BookMerge }) => {
	return (
		<tr>
			<td className="p-1 md:p-2 align-middle">
				<div className="space-y-1">
					{merge.variants.map((variant) => (
						<BookCell key={variant.id} book={variant} />
					))}
				</div>
			</td>
			<td className="p-1 md:p-2 text-center align-middle">
				<span className="text-gray-400 text-lg md:text-2xl font-bold">→</span>
			</td>
			<td className="p-1 md:p-2 align-middle">
				<BookCell book={merge.base} />
			</td>
		</tr>
	);
};

const BookMergesPage = () => {
	useDocumentTitle('本の統合 | 萌メーター');

	const { data, isLoading, error } = useQuery<BookMerge[]>({
		queryKey: ['bookMerges'],
		queryFn: getBookMerges,
	});

	if (isLoading) {
		return (
			<div className="flex flex-col justify-center items-center min-h-[70vh]">
				<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-4"></div>
				<div className="text-gray-400 text-sm">本の統合データを読み込み中...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-[70vh] text-red-600">
				エラーが発生しました
			</div>
		);
	}

	if (!data || data.length === 0) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center text-gray-500">統合する本はありません</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-2 md:px-4 py-4 md:py-8 max-w-7xl">
			<h1 className="text-xl md:text-2xl font-bold mt-2 mb-2 text-gray-800">本の統合</h1>
			<p className="text-center text-sm mb-4 text-gray-500">全{data.length}件</p>

			<div className="bg-white rounded-lg md:rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
				<table className="w-full min-w-[400px]">
					<thead className="bookmeter-green text-white text-center font-semibold">
						<tr>
							<th className="px-2 md:px-4 py-2 md:py-3 text-center text-xs md:text-base">異版</th>
							<th className="px-1 md:px-4 py-2 md:py-3 text-center text-xs md:text-base w-8 md:w-16"></th>
							<th className="px-2 md:px-4 py-2 md:py-3 text-center text-xs md:text-base">基本版</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{data.map((merge) => (
							<BookMergeRow key={merge.base.id} merge={merge} />
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default BookMergesPage;
