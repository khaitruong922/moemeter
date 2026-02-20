import { useQuery } from '@tanstack/react-query';
import { getCommonReads } from '../../api/users';
import { UserReadCard } from '../UserReadCard';
import { SectionHeader } from '../SectionHeader';
import { LoadingSpinner } from '../LoadingSpinner';
import type { Book, User, CommonReadsResponse } from '../../types/models';

interface UserReadCount {
	user: User;
	readCount: number;
	commonBooks: Book[];
}

interface ProfileFriendsTabProps {
	userId: number;
}

export const ProfileFriendsTab: React.FC<ProfileFriendsTabProps> = ({ userId }) => {
	const { data: commonReadsData, isLoading } = useQuery<CommonReadsResponse>({
		enabled: !!userId,
		queryKey: ['commonReads', userId],
		queryFn: () => getCommonReads(userId),
	});

	const userReadCounts: UserReadCount[] = commonReadsData
		? Object.values(commonReadsData.users)
				.map((u) => {
					const commonBooks = u.book_ids.map((bookId) => commonReadsData.books[bookId.toString()]);
					return {
						user: u,
						readCount: u.book_ids.length,
						commonBooks,
					};
				})
				.sort((a, b) => {
					const readCountDiff = b.readCount - a.readCount;
					if (readCountDiff !== 0) return readCountDiff;
					return a.user.id - b.user.id;
				})
		: [];

	return (
		<>
			<SectionHeader
				title="読書仲間"
				count={userReadCounts.length > 0 ? `全${userReadCounts.length}人` : undefined}
				emptyMessage={userReadCounts.length === 0 ? '読書仲間はまだいません。' : undefined}
				isLoading={isLoading}
				loadingMessage="共読データを読み込み中..."
			/>
			{isLoading ? (
				<div className="min-h-[50vh] pt-8">
					<LoadingSpinner message="共読データを読み込み中..." />
				</div>
			) : (
				<div className="space-y-4">
					{userReadCounts.map((userReadCount, index) => (
						<UserReadCard key={userReadCount.user.id} {...userReadCount} index={index + 1} />
					))}
				</div>
			)}
		</>
	);
};
