import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getBooksLibrary, type BooksLibraryApiResponse } from '../api/books';

const BooksLibraryPage: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [currentPage, setCurrentPage] = useState(() => {
		const pageParam = searchParams.get('page');
		return pageParam ? parseInt(pageParam, 10) : 1;
	});
	const perPage = 200;

	const { data, isLoading, error } = useQuery<BooksLibraryApiResponse>({
		queryKey: ['booksLibrary', currentPage, perPage],
		queryFn: () => getBooksLibrary(currentPage, perPage),
	});

	const books = data?.books || [];
	const totalCount = data?.total_count || 0;
	const maxPage = data?.max_page || 1;

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		setSearchParams({ page: page.toString() });
	};

	const renderPagination = () => {
		if (maxPage <= 1) return null;

		const pages = [];
		const showPages = 5; // Show 5 pages around current
		let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
		let endPage = Math.min(maxPage, startPage + showPages - 1);

		if (endPage - startPage + 1 < showPages) {
			startPage = Math.max(1, endPage - showPages + 1);
		}

		// Add first page if not in range
		if (startPage > 1) {
			pages.push(
				<button
					key={1}
					onClick={() => handlePageChange(1)}
					className="px-3 py-2 mx-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
				>
					1
				</button>
			);
			if (startPage > 2) {
				pages.push(
					<span key="start-ellipsis" className="px-2">
						...
					</span>
				);
			}
		}

		// Add pages in range
		for (let i = startPage; i <= endPage; i++) {
			pages.push(
				<button
					key={i}
					onClick={() => handlePageChange(i)}
					className={`px-3 py-2 mx-1 text-sm border rounded cursor-pointer ${
						i === currentPage
							? 'bg-[#77b944] text-white border-[#77b944]'
							: 'bg-white border-gray-300 hover:bg-gray-50'
					}`}
				>
					{i}
				</button>
			);
		}

		// Add last page if not in range
		if (endPage < maxPage) {
			if (endPage < maxPage - 1) {
				pages.push(
					<span key="end-ellipsis" className="px-2">
						...
					</span>
				);
			}
			pages.push(
				<button
					key={maxPage}
					onClick={() => handlePageChange(maxPage)}
					className="px-3 py-2 mx-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
				>
					{maxPage}
				</button>
			);
		}

		return (
			<div className="flex justify-center items-center mt-6 pb-6">
				<button
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className="px-3 py-2 mx-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
				>
					前へ
				</button>
				{pages}
				<button
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === maxPage}
					className="px-3 py-2 mx-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
				>
					次へ
				</button>
			</div>
		);
	};

	if (isLoading) {
		return (
			<div className="flex flex-col justify-center items-center min-h-[50vh]">
				<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-4"></div>
				<div className="text-gray-400 text-sm">本棚を読み込み中...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-[50vh]">
				<div className="text-red-600 bg-red-50 p-4 rounded-lg">
					<p className="font-medium">エラーが発生しました</p>
					<p className="text-sm mt-1">
						{error instanceof Error ? error.message : '本の一覧を取得できませんでした'}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center min-h-[70vh] w-full pt-10">
			<div className="w-full max-w-6xl px-4 mb-4 text-center">
				<h2 className="text-2xl font-bold text-gray-800 mb-2">本棚</h2>
				<p className="text-sm text-gray-500 mt-1">
					全 {totalCount} 冊 (ページ {currentPage} / {maxPage})
				</p>
			</div>

			<div className="w-full max-w-6xl px-4">
				<table className="w-full border-collapse border border-gray-300">
					<thead>
						<tr className="bg-gray-50">
							<th className="border border-gray-300 px-4 py-2 text-center">サムネイル</th>
							<th className="border border-gray-300 px-4 py-2 text-center">タイトル</th>
							<th className="border border-gray-300 px-4 py-2 text-center">著者</th>
							<th className="border border-gray-300 px-4 py-2 text-center">ID</th>
						</tr>
					</thead>
					<tbody>
						{books.map((book) => (
							<tr key={book.id} className="hover:bg-gray-50">
								<td className="border border-gray-300 px-4 py-2">
									<a
										href={`https://bookmeter.com/books/${book.id}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<img src={book.thumbnail_url} alt={book.title} width={120} loading="lazy" />
									</a>
								</td>
								<td className="border border-gray-300 px-4 py-2">{book.title}</td>
								<td className="border border-gray-300 px-4 py-2">{book.author}</td>
								<td className="border border-gray-300 px-4 py-2">{book.id}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{renderPagination()}
		</div>
	);
};

export default BooksLibraryPage;
