import { useQuery } from '@tanstack/react-query';
import { getLeaderboard } from '../api/users';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { Layout } from '../Layout';

const LeaderboardPage = () => {
	const { data } = useQuery({ queryKey: ['todos'], queryFn: getLeaderboard });
	const users = data || [];

	return (
		<Layout
			title="読書メーター | 読書ランキング"
			children={
				<div className="flex flex-col items-center min-h-[70vh] justify-center">
					<div className="mb-8 text-center">
						<h2 className="text-2xl font-bold text-gray-800 mb-2">読書ランキング</h2>
						<p className="text-base text-gray-600">
							読書メーターのユーザーの読書量ランキングです。
						</p>
					</div>
					<LeaderboardTable users={users} />
					<div className="mt-8 text-center text-xs text-gray-400">
						最終更新: {new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
					</div>
				</div>
			}
		/>
	);
};

export default LeaderboardPage;
