import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getBooks } from '../api/books';
import { getGroups } from '../api/groups';
import { getMetadata } from '../api/metadata';
import { BookList } from '../components/BookList';
import { formatDatetime } from '../utils/datetime';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { useSearchParams } from 'react-router-dom';

const BooksPage = () => {
	useDocumentTitle('みんなの本棚 | 読書メーター Plus');
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
	const searchQuery = searchParams.get('q') || '';

	const {
		data,
		isLoading: isBooksLoading,
		error: booksError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ['books', searchQuery],
		queryFn: ({ pageParam = 1 }) => getBooks(pageParam, searchQuery),
		getNextPageParam: (lastPage) => lastPage.pageInfo.nextPage,
		initialPageParam: 1,
	});

	const { data: groupsData } = useQuery({
		queryKey: ['groups'],
		queryFn: getGroups,
	});
	const { data: metadata } = useQuery({ queryKey: ['metadata'], queryFn: getMetadata });

	const groupName = groupsData?.[0]?.name || 'グループ';

	// Combine all books from all pages and get users
	const books = data?.pages.flatMap((page) => page.books) || [];
	// Aggregate users from all pages
	const users = data?.pages.reduce((acc, page) => ({ ...acc, ...page.users }), {}) || {};
	const totalCount = data?.pages[0]?.total_count || 0;

	// Handle search input
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchInput.trim()) {
			setSearchParams({ q: searchInput.trim() });
		} else {
			setSearchParams({});
		}
	};

	// Infinite scroll implementation
	const observerTarget = useRef<HTMLDivElement>(null);

	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const [target] = entries;
			if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
				fetchNextPage();
			}
		},
		[fetchNextPage, hasNextPage, isFetchingNextPage]
	);

	useEffect(() => {
		const element = observerTarget.current;
		if (!element) return;

		const observer = new IntersectionObserver(handleObserver, {
			threshold: 0.1,
		});

		observer.observe(element);

		return () => {
			if (element) {
				observer.unobserve(element);
			}
		};
	}, [handleObserver]);

	const renderContent = () => {
		if (isBooksLoading) {
			return (
				<div className="flex flex-col justify-center items-center min-h-[50vh]">
					<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-4"></div>
					<div className="text-gray-400 text-sm">みんなの本棚を読み込み中...</div>
				</div>
			);
		}

		if (booksError) {
			return (
				<div className="flex justify-center items-center min-h-[50vh]">
					<div className="text-red-600 bg-red-50 p-4 rounded-lg">
						<p className="font-medium">エラーが発生しました</p>
						<p className="text-sm mt-1">
							{booksError instanceof Error ? booksError.message : '本の一覧を取得できませんでした'}
						</p>
					</div>
				</div>
			);
		}

		if (!data || books.length === 0) {
			return (
				<div className="flex justify-center items-start min-h-[30vh] pt-8">
					<div className="text-center">
						<p className="text-gray-600 text-lg mb-4">
							{searchQuery ? '検索結果が見つかりませんでした' : 'まだ本が登録されていません'}
						</p>
						{searchQuery && (
							<p className="text-sm text-gray-500">別のキーワードで検索してください</p>
						)}
					</div>
				</div>
			);
		}

		return (
			<div className="w-full px-4">
				<BookList books={books} users={users} />
				{isFetchingNextPage && (
					<div className="flex justify-center my-4">
						<div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
					</div>
				)}
				<div ref={observerTarget} className="h-4" />
			</div>
		);
	};

	return (
		<div className="flex flex-col items-center min-h-[70vh] w-full pt-10">
			<div className="mb-4 text-center">
				<h2 className="text-2xl font-bold text-gray-800 mb-2">みんなの本棚</h2>
				<p className="mt-1 text-center text-xs text-gray-400">
					最終更新: {formatDatetime(metadata?.last_updated)}
				</p>
				<p className="mt-2 text-base text-gray-600">{groupName}のメンバーが読んだ本の一覧です。</p>
				<p className="text-sm text-gray-500 mt-1">
					{searchQuery ? `「${searchQuery}」の検索結果: ` : '全'}
					{isBooksLoading ? '検索中...' : `${totalCount}冊`}
					{searchQuery && !isBooksLoading && (
						<button
							onClick={() => {
								setSearchInput('');
								setSearchParams({});
							}}
							className="ml-2 text-[#5ba865] hover:underline cursor-pointer"
						>
							検索をクリア
						</button>
					)}
				</p>
			</div>

			<div className="w-full max-w-xl px-4 mb-6">
				<form onSubmit={handleSearch} className="flex">
					<input
						type="search"
						id="bookmeter-plus-q"
						name="bookmeter-plus-q"
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						placeholder="タイトル・著者名"
						className="flex-1 h-[34px] px-3 bg-white border border-r-0 border-gray-300 rounded-l focus:outline-none"
					/>
					<button
						type="submit"
						className="w-[40px] h-[34px] flex items-center justify-center bookmeter-green text-white rounded-r cursor-pointer"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className="w-4 h-4"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
							/>
						</svg>
					</button>
				</form>
			</div>

			{renderContent()}
		</div>
	);
};

export default BooksPage;
