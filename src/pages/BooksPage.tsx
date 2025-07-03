import { useEffect, useRef, useCallback } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getBooks } from '../api/books';
import { BookList } from '../components/BookList';
import { getGroups } from '../api/groups';

const BooksPage = () => {
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

	if (!data || books.length === 0) {
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
				<div className="mt-8 text-center text-xs text-gray-400">
					最終更新: {new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
				</div>
			</div>
		</div>
	);
};

export default BooksPage;
