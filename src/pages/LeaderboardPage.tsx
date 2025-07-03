import { useQuery } from '@tanstack/react-query';
import { getLeaderboard } from '../api/users';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { getGroups } from '../api/groups';

const LeaderboardPage = () => {
	const { data: usersData } = useQuery({ queryKey: ['leaderboard'], queryFn: getLeaderboard });
	const { data: groupsData } = useQuery({
		queryKey: ['groups'],
		queryFn: getGroups,
	});

	const users = usersData || [];
	const groupName = groupsData?.[0]?.name || 'グループ';
	const total_count = usersData?.length || 0;

	return (
		<div className="flex flex-col items-center min-h-[70vh] w-full pt-10">
			<div className="mb-8 text-center">
				<h2 className="text-2xl font-bold text-gray-800 mb-2">読書ランキング</h2>
				<p className="text-base text-gray-600">{groupName}のメンバーの読書量ランキングです。</p>
				<p className="text-sm text-gray-500 mt-1">全{total_count}人</p>
			</div>
			<LeaderboardTable users={users} />
			<div className="mt-8 text-center text-xs text-gray-400">
				最終更新: {new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
			</div>
		</div>
	);
};

export default LeaderboardPage;
