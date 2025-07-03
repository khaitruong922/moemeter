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
				<>
					<div className="max-w-4xl mx-auto">
						<div className="mb-8">
							<h2 className="text-xl font-bold text-gray-800 mb-2">読書ランキング</h2>
							<p className="text-sm text-gray-600">
								読書メーターのユーザーの読書量ランキングです。
							</p>
						</div>
						<LeaderboardTable users={users} />
						<div className="mt-6 text-center text-xs text-gray-500">
							最終更新: {new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
						</div>
					</div>
				</>
			}
		/>
	);
};

export default LeaderboardPage;
