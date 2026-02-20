import { useQuery } from '@tanstack/react-query';
import { getCommonReads } from '../../api/users';
import { UserReadCard } from '../UserReadCard';
import { SectionHeader } from '../SectionHeader';
import { LoadingSpinner } from '../LoadingSpinner';
import { formatDatetime } from '../../utils/datetime';
import type { Book, User, CommonReadsResponse } from '../../types/models';

interface UserReadCount {
	user: User;
	readCount: number;
	commonBooks: Book[];
}

interface ProfileCommonReadersTabProps {
	userId: number;
	metadata?: {
		last_updated: string;
		failed_users: number;
		total_users: number;
	};
}

export const ProfileCommonReadersTab: React.FC<ProfileCommonReadersTabProps> = ({
	userId,
	metadata,
}) => {
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
				title="共読仲間"
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
				description="一緒に本を読んだメンバーです。"
				count={userReadCounts.length > 0 ? `全${userReadCounts.length}人` : undefined}
				emptyMessage={userReadCounts.length === 0 ? '共読仲間はまだいません。' : undefined}
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
