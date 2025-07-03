import { useQuery } from '@tanstack/react-query';
import { getLeaderboard } from '../api/users';
import { LeaderboardTable } from '../components/LeaderboardTable';

const LeaderboardPage = () => {
	const { data } = useQuery({ queryKey: ['todos'], queryFn: getLeaderboard });
	const users = data || [];
	const groupName = 'TMW Novel Club';

	return (
		<div className="flex flex-col items-center min-h-[70vh] w-full pt-10">
			<div className="mb-8 text-center">
				<h2 className="text-2xl font-bold text-gray-800 mb-2">読書ランキング</h2>
				<p className="text-base text-gray-600">{groupName}のユーザーの読書量ランキングです。</p>
			</div>
			<LeaderboardTable users={users} />
			<div className="mt-8 text-center text-xs text-gray-400">
				最終更新: {new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
			</div>
		</div>
	);
};

export default LeaderboardPage;
