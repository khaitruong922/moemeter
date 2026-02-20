import { useInfiniteQuery } from '@tanstack/react-query';
import { getBooks } from '../../api/books';
import { BookList } from '../BookList';
import { LoadingSpinner } from '../LoadingSpinner';
import { SectionHeader } from '../SectionHeader';
import { useUser } from '../../context/useUser';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

type FilterType = 'all' | 'lonely';

interface ProfileReadsTabProps {
	userId: number;
	defaultFilter?: FilterType;
}

export const ProfileReadsTab: React.FC<ProfileReadsTabProps> = ({
	userId,
	defaultFilter = 'all',
}) => {
	const { user: currentUser } = useUser();
	const currentUserId = currentUser?.id;

	const isLonely = defaultFilter === 'lonely';
	const isLatest = defaultFilter === 'all';

	const {
		data: booksData,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ['books', '', 'all', 'all', userId, isLonely, isLatest],
		queryFn: ({ pageParam = 1 }) =>
			getBooks(pageParam, '', 'all', 'all', userId, isLonely, isLatest),
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

	return (
		<>
			<SectionHeader
				title={defaultFilter === 'lonely' ? 'ひとりぼっち本' : '読んだ本'}
				count={books.length > 0 ? `全${totalCount}冊` : undefined}
				emptyMessage={
					books.length === 0
						? defaultFilter === 'lonely'
							? 'このユーザーしか読んでいない本はありません。'
							: '読んだ本はまだありません。'
						: undefined
				}
				isLoading={isLoading}
				loadingMessage="読書データを読み込み中..."
			/>

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
