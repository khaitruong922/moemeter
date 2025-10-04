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

	// Load from localStorage first, then URL params, then defaults
	const getInitialPeriod = () => {
		const urlPeriod = searchParams.get('period');
		if (urlPeriod) return urlPeriod;
		const stored = localStorage.getItem('leaderboard_period');
		return stored || 'all';
	};

	const getInitialOrder = () => {
		const urlOrder = searchParams.get('order');
		if (urlOrder) return urlOrder;
		const stored = localStorage.getItem('leaderboard_order');
		return stored || 'books';
	};

	const [period, setPeriod] = useState<string>(getInitialPeriod());
	const [order, setOrder] = useState<string>(getInitialOrder());

	// Sync state with URL parameters and localStorage
	useEffect(() => {
		const urlPeriod = searchParams.get('period');
		const urlOrder = searchParams.get('order');

		if (urlPeriod) {
			setPeriod(urlPeriod);
			localStorage.setItem('leaderboard_period', urlPeriod);
		} else {
			const storedPeriod = localStorage.getItem('leaderboard_period') || 'all';
			setPeriod(storedPeriod);
		}

		if (urlOrder) {
			setOrder(urlOrder);
			localStorage.setItem('leaderboard_order', urlOrder);
		} else {
			const storedOrder = localStorage.getItem('leaderboard_order') || 'books';
			setOrder(storedOrder);
		}
	}, [searchParams]);

	const { user: currentUser } = useUser();

	const { data: usersData, isLoading: isLeaderboardLoading } = useQuery({
		queryKey: ['leaderboard', period, order],
		queryFn: () => getLeaderboard(period, order),
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

				<div className="mx-2 sm:mx-4 w-full md:w-3/4 max-w-[1200px] mb-6">
					<div className="flex items-start justify-between">
						<div className="flex rounded-lg overflow-hidden border border-[#5ba865]/20">
							<button
								type="button"
								onClick={() => {
									setPeriod('all');
									localStorage.setItem('leaderboard_period', 'all');
									setSearchParams({ order });
								}}
								className={`text-sm sm:text-base py-2 px-4 sm:px-6 font-medium transition-colors cursor-pointer ${
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
									localStorage.setItem('leaderboard_period', 'this_year');
									setSearchParams({ period: 'this_year', order });
								}}
								className={`text-sm sm:text-base py-2 px-4 sm:px-6 font-medium transition-colors cursor-pointer border-l border-[#5ba865]/20 ${
									period === 'this_year'
										? 'bookmeter-green text-white'
										: 'bg-white text-[#5ba865] hover:bg-[#f0fae8]'
								}`}
							>
								{currentYear}年
							</button>
						</div>
						<div className="flex rounded-lg overflow-hidden border border-[#5ba865]/20">
							<button
								type="button"
								onClick={() => {
									setOrder('books');
									localStorage.setItem('leaderboard_order', 'books');
									setSearchParams({ period, order: 'books' });
								}}
								className={`text-sm sm:text-base py-2 px-4 sm:px-6 font-medium transition-colors cursor-pointer ${
									order === 'books'
										? 'bookmeter-green text-white'
										: 'bg-white text-[#5ba865] hover:bg-[#f0fae8]'
								}`}
							>
								本数順
							</button>
							<button
								type="button"
								onClick={() => {
									setOrder('pages');
									localStorage.setItem('leaderboard_order', 'pages');
									setSearchParams({ period, order: 'pages' });
								}}
								className={`text-sm sm:text-base py-2 px-4 sm:px-6 font-medium transition-colors cursor-pointer border-l border-[#5ba865]/20 ${
									order === 'pages'
										? 'bookmeter-green text-white'
										: 'bg-white text-[#5ba865] hover:bg-[#f0fae8]'
								}`}
							>
								ページ数順
							</button>
						</div>
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
