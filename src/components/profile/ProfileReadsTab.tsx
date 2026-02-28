import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getBooks } from '../../api/books';
import { useUser } from '../../context/useUser';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import type { SortOrder } from '../../types/queryParams';
import { BookList } from '../BookList';
import { FilterButton, FilterGroup } from '../FilterButton';
import { LoadingSpinner } from '../LoadingSpinner';
import { SectionHeader } from '../SectionHeader';

type PageType = 'reads' | 'lonely_books';

interface ProfileReadsTabProps {
	userId: number;
	pageType: PageType;
}

export const ProfileReadsTab: React.FC<ProfileReadsTabProps> = ({ userId, pageType }) => {
	const { user: currentUser } = useUser();
	const currentUserId = currentUser?.id;
	const [dateOrder, setDateOrder] = useState<SortOrder>('DESC');

	const isLonely = pageType === 'lonely_books';

	const {
		data: booksData,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ['books', '', 'reads', 'reads', userId, isLonely, dateOrder],
		queryFn: ({ pageParam = 1 }) =>
			getBooks({
				page: pageParam,
				userId,
				lonely: isLonely,
				dateOrder,
			}),
		getNextPageParam: (lastPage) => lastPage.pageInfo.nextPage,
		initialPageParam: 1,
		enabled: !!userId,
	});

	const handleDateOrderChange = (newDateOrder: SortOrder) => {
		setDateOrder(newDateOrder as SortOrder);
	};

	const { observerTarget } = useInfiniteScroll({
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	});

	const books = booksData?.pages.flatMap((page) => page.books) || [];
	const users = booksData?.pages.reduce((acc, page) => ({ ...acc, ...page.users }), {}) || {};
	const totalCount = booksData?.pages[0]?.total_count || 0;

	return (
		<>
			<SectionHeader
				title={isLonely ? 'ひとりぼっち本' : '読んだ本'}
				count={books.length > 0 ? `全${totalCount}冊` : undefined}
				emptyMessage={
					books.length === 0
						? isLonely
							? 'このメンバーしか読んでいない本はありません。'
							: '読んだ本はまだありません。'
						: undefined
				}
				isLoading={isLoading}
				loadingMessage="読書データを読み込み中..."
			/>

			<div className="mb-6">
				<FilterGroup>
					<FilterButton
						value="DESC"
						currentValue={dateOrder}
						label="最新順"
						onClick={(value) => handleDateOrderChange(value as SortOrder)}
					/>
					<FilterButton
						value="ASC"
						currentValue={dateOrder}
						label="古い順"
						onClick={(value) => handleDateOrderChange(value as SortOrder)}
						borderClass="border-l border-[#77b944]/20"
					/>
				</FilterGroup>
			</div>

			{isLoading ? (
				<div className="min-h-[50vh] pt-8">
					<LoadingSpinner message="読書データを読み込み中..." />
				</div>
			) : (
				<div className="w-full">
					<BookList
						books={books}
						users={users}
						currentUserId={currentUserId}
						fullWidth
						isLonely={isLonely}
					/>
					{isFetchingNextPage && (
						<div className="my-4">
							<LoadingSpinner size="sm" />
						</div>
					)}
					<div ref={observerTarget} className="h-4" />
				</div>
			)}
		</>
	);
};
