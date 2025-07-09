import { useQuery } from '@tanstack/react-query';
import { getGroups } from '../api/groups';
import { getMetadata } from '../api/metadata';
import { getLeaderboard } from '../api/users';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { formatDatetime } from '../utils/datetime';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { useUser } from '../context/userContext';

const LeaderboardPage = () => {
	useDocumentTitle('読書ランキング | 萌メーター');
	const { user: currentUser } = useUser();
	const { data: usersData, isLoading: isLeaderboardLoading } = useQuery({
		queryKey: ['leaderboard'],
		queryFn: getLeaderboard,
	});
	const { data: groupsData } = useQuery({
		queryKey: ['groups'],
		queryFn: getGroups,
	});
	const { data: metadata } = useQuery({ queryKey: ['metadata'], queryFn: getMetadata });

	const users = usersData || [];
	const groupName = groupsData?.[0]?.name || 'グループ';
	const total_count = usersData?.length || 0;

	return (
		<>
			<div className="flex flex-col items-center min-h-[70vh] w-full py-10">
				<div className="mb-4 text-center">
					<h2 className="text-2xl font-bold text-gray-800 mb-2">読書ランキング</h2>
					<p className="mt-1 text-center text-xs text-gray-400">
						最終更新: {formatDatetime(metadata?.last_updated)}
						{typeof metadata?.total_users === 'number' &&
							typeof metadata?.failed_users === 'number' && (
								<span>
									同期済み: {metadata.total_users - metadata.failed_users}人/{metadata.total_users}
									人
								</span>
							)}
					</p>
					<p className="mt-2 text-base text-gray-600">
						{groupName}のメンバーの読書量ランキングです。
					</p>
					<p className="text-sm text-gray-500 mt-1">
						{isLeaderboardLoading ? '読み込み中...' : `全${total_count}人`}
					</p>
				</div>
				<LeaderboardTable
					users={users}
					loading={isLeaderboardLoading}
					currentUserId={currentUser?.id}
				/>
			</div>
		</>
	);
};

export default LeaderboardPage;
