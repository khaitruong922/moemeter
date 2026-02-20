import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getBooks } from '../../api/books';
import { BookList } from '../BookList';
import { LoadingSpinner } from '../LoadingSpinner';
import { FilterButton, FilterGroup } from '../FilterButton';
import { SectionHeader } from '../SectionHeader';
import { useUser } from '../../context/useUser';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { formatDatetime } from '../../utils/datetime';

interface ProfileReadsTabProps {
	userId: number;
	metadata?: {
		last_updated: string;
		failed_users: number;
		total_users: number;
	};
}

type FilterType = 'all' | 'lonely';

export const ProfileReadsTab: React.FC<ProfileReadsTabProps> = ({ userId, metadata }) => {
	const { user: currentUser } = useUser();
	const currentUserId = currentUser?.id;
	const [filter, setFilter] = useState<FilterType>('all');

	const isLonely = filter === 'lonely';

	const {
		data: booksData,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ['books', '', 'all', 'all', userId, isLonely],
		queryFn: ({ pageParam = 1 }) => getBooks(pageParam, '', 'all', 'all', userId, isLonely),
		getNextPageParam: (lastPage) => lastPage.pageInfo.nextPage,
		initialPageParam: 1,
		enabled: !!userId,
	});

	const { observerTarget } = useInfiniteScroll({
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	});

	const books = booksData?.pages.flatMap((page) => page.books) || [];
	const users = booksData?.pages.reduce((acc, page) => ({ ...acc, ...page.users }), {}) || {};
	const totalCount = booksData?.pages[0]?.total_count || 0;
	const totalReadsCount = booksData?.pages[0]?.total_reads_count || 0;

	return (
		<>
			<SectionHeader
				title={filter === 'lonely' ? 'ひとりぼっち本' : '共読本'}
				metadata={
					metadata
						? `最終更新: ${formatDatetime(metadata.last_updated)}${
								typeof metadata.total_users === 'number' &&
								typeof metadata.failed_users === 'number'
									? ` 同期済み: ${metadata.total_users - metadata.failed_users}/${metadata.total_users}人`
									: ''
							}`
						: undefined
				}
				description={
					filter === 'lonely'
						? 'このユーザーしか読んでいない本です。'
						: '他のメンバーと一緒に読んだ本です。'
				}
				count={books.length > 0 ? `${totalCount}冊 | ${totalReadsCount}読破` : undefined}
				emptyMessage={
					books.length === 0
						? filter === 'lonely'
							? 'このユーザーしか読んでいない本はありません。'
							: '共読本はまだありません。'
						: undefined
				}
				isLoading={isLoading}
				loadingMessage="読書データを読み込み中..."
			/>

			{/* Filter */}
			<div className="w-full max-w-md mx-auto px-4 mb-6">
				<FilterGroup>
					<FilterButton
						value="all"
						currentValue={filter}
						label="すべて"
						onClick={(v) => setFilter(v as FilterType)}
					/>
					<FilterButton
						value="lonely"
						currentValue={filter}
						label="ひとりぼっち本"
						onClick={(v) => setFilter(v as FilterType)}
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
					<BookList books={books} users={users} currentUserId={currentUserId} fullWidth />
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
