import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getGroups } from '../api/groups';
import { getMetadata } from '../api/metadata';
import { getLeaderboard } from '../api/users';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { useUser } from '../context/useUser';
import { formatDatetime } from '../utils/datetime';
import { useDocumentTitle } from '../utils/useDocumentTitle';

const LeaderboardPage = () => {
	const currentDate = new Date();
	const currentYear = currentDate.getUTCFullYear();

	useDocumentTitle('読書ランキング | 萌メーター');
	const [searchParams, setSearchParams] = useSearchParams();
	const [period, setPeriod] = useState<string>(searchParams.get('period') || 'all');

	// Sync state with URL parameters
	useEffect(() => {
		setPeriod(searchParams.get('period') || 'all');
	}, [searchParams]);

	const { user: currentUser } = useUser();

	const { data: usersData, isLoading: isLeaderboardLoading } = useQuery({
		queryKey: ['leaderboard', period],
		queryFn: () => getLeaderboard(period),
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
								<span className="ml-2">
									同期済み: {metadata.total_users - metadata.failed_users}/{metadata.total_users}人
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

				<div className="w-full max-w-xl px-4 mb-6">
					<div className="flex w-full rounded-lg overflow-hidden border border-[#5ba865]/20">
						<button
							type="button"
							onClick={() => {
								setPeriod('all');
								setSearchParams({});
							}}
							className={`flex-1 text-sm py-2 px-4 font-medium transition-colors cursor-pointer ${
								period === 'all'
									? 'bookmeter-green text-white'
									: 'bg-white text-[#5ba865] hover:bg-[#f0fae8]'
							}`}
						>
							全期間
						</button>
						<button
							type="button"
							onClick={() => {
								setPeriod('this_year');
								setSearchParams({ period: 'this_year' });
							}}
							className={`flex-1 text-sm py-2 px-4 font-medium transition-colors cursor-pointer border-l border-[#5ba865]/20 ${
								period === 'this_year'
									? 'bookmeter-green text-white'
									: 'bg-white text-[#5ba865] hover:bg-[#f0fae8]'
							}`}
						>
							{currentYear}年
						</button>
					</div>
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
