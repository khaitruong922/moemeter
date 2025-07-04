import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { getBooks } from '../api/books';
import { getGroups } from '../api/groups';
import { getMetadata } from '../api/metadata';
import { BookList } from '../components/BookList';
import { formatDatetime } from '../utils/datetime';
import { useDocumentTitle } from '../utils/useDocumentTitle';

const BooksPage = () => {
	useDocumentTitle('みんなの本棚 | 読書メーター Plus');
	const {
		data,
		isLoading: isBooksLoading,
		error: booksError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ['books'],
		queryFn: ({ pageParam = 1 }) => getBooks(pageParam),
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
	const users = data?.pages[0]?.users || {};
	const totalCount = data?.pages[0]?.total_count || 0;

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

	if (isBooksLoading) {
		return (
			<div className="flex flex-col justify-center items-center min-h-[70vh]">
				<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-4"></div>
				<div className="text-gray-400 text-sm">みんなの本棚を読み込み中...</div>
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

	if (!data || books.length === 0) {
		return (
			<div className="flex flex-col items-center min-h-[70vh] w-full pt-10">
				<div className="mb-8 text-center">
					<h2 className="text-2xl font-bold text-gray-800 mb-2">みんなの本棚</h2>
					<p className="text-base text-gray-600">{groupName}のメンバーが読んでいる本の一覧です。</p>
				</div>
				<div className="text-gray-600 bg-gray-50 p-4 rounded-lg">まだ本が登録されていません</div>
			</div>
		);
	}

	return (
		<>
			<div className="flex flex-col items-center min-h-[70vh] w-full pt-10">
				<div className="mb-4 text-center">
					<h2 className="text-2xl font-bold text-gray-800 mb-2">みんなの本棚</h2>
					<p className="mt-1 text-center text-xs text-gray-400">
						最終更新: {formatDatetime(metadata?.last_updated)}
					</p>
					<p className="mt-2 text-base text-gray-600">
						{groupName}のメンバーが読んでいる本の一覧です。
					</p>
					<p className="text-sm text-gray-500 mt-1">全{totalCount}冊</p>
				</div>
				<div className="w-full px-4">
					<BookList books={books} users={users} />
					{isFetchingNextPage && (
						<div className="flex justify-center my-4">
							<div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
						</div>
					)}
					<div ref={observerTarget} className="h-4" />
				</div>
			</div>
		</>
	);
};

export default BooksPage;
