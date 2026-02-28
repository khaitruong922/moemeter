import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getLeaderboard } from '../api/users';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { SectionHeader } from '../components/SectionHeader';
import { useUser } from '../context/useUser';
import { useDocumentTitle } from '../utils/useDocumentTitle';

const LeaderboardPage = () => {
	const currentDate = new Date();
	const currentYear = currentDate.getUTCFullYear();

	useDocumentTitle('読書ランキング | 萌メーター');
	const [searchParams, setSearchParams] = useSearchParams();

	// Load from localStorage first, then URL params, then defaults
	const getInitialPeriod = (): string | null => {
		const urlPeriod = searchParams.get('period');
		if (urlPeriod) return urlPeriod;
		const stored = localStorage.getItem('leaderboard_period');
		return stored || null;
	};

	const getInitialOrder = (): string => {
		const urlOrder = searchParams.get('order');
		if (urlOrder) return urlOrder;
		const stored = localStorage.getItem('leaderboard_order');
		return stored || 'books';
	};

	const [period, setPeriod] = useState<string | null>(getInitialPeriod());
	const [order, setOrder] = useState<string>(getInitialOrder());

	// Sync state with URL parameters and localStorage
	useEffect(() => {
		const urlPeriod = searchParams.get('period');
		const urlOrder = searchParams.get('order');

		if (urlPeriod) {
			setPeriod(urlPeriod);
			localStorage.setItem('leaderboard_period', urlPeriod);
		} else {
			const storedPeriod = localStorage.getItem('leaderboard_period') || null;
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

	const users = usersData || [];
	const total_count = usersData?.length || 0;

	return (
		<>
			<div className="flex flex-col items-center min-h-[70vh] w-full py-10">
				<SectionHeader
					title="読書ランキング"
					count={isLeaderboardLoading ? undefined : `全${total_count}人`}
					isLoading={isLeaderboardLoading}
					loadingMessage="読み込み中..."
				/>

				<div className="mx-2 sm:mx-4 w-full md:w-3/4 max-w-[1200px] mb-6">
					<div className="flex items-start justify-between">
						<div className="flex rounded-lg overflow-hidden border border-[#77b944]/20">
							<button
								type="button"
								onClick={() => {
									setPeriod(null);
									localStorage.removeItem('leaderboard_period');
									setSearchParams(order ? { order } : {});
								}}
								className={`text-sm sm:text-base py-2 px-4 sm:px-6 font-medium transition-colors cursor-pointer ${
									period === null
										? 'bookmeter-green text-white'
										: 'bg-white text-[#77b944] hover:bg-[#f0fae8]'
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
								className={`text-sm sm:text-base py-2 px-4 sm:px-6 font-medium transition-colors cursor-pointer border-l border-[#77b944]/20 ${
									period === 'this_year'
										? 'bookmeter-green text-white'
										: 'bg-white text-[#77b944] hover:bg-[#f0fae8]'
								}`}
							>
								{currentYear}年
							</button>
						</div>
						<div className="flex rounded-lg overflow-hidden border border-[#77b944]/20">
							<button
								type="button"
								onClick={() => {
									setOrder('books');
									localStorage.setItem('leaderboard_order', 'books');
									setSearchParams({ ...(period ? { period } : {}), order: 'books' });
								}}
								className={`text-sm sm:text-base py-2 px-4 sm:px-6 font-medium transition-colors cursor-pointer ${
									order === 'books'
										? 'bookmeter-green text-white'
										: 'bg-white text-[#77b944] hover:bg-[#f0fae8]'
								}`}
							>
								冊数順
							</button>
							<button
								type="button"
								onClick={() => {
									setOrder('pages');
									localStorage.setItem('leaderboard_order', 'pages');
									setSearchParams({ ...(period ? { period } : {}), order: 'pages' });
								}}
								className={`text-sm sm:text-base py-2 px-4 sm:px-6 font-medium transition-colors cursor-pointer border-l border-[#77b944]/20 ${
									order === 'pages'
										? 'bookmeter-green text-white'
										: 'bg-white text-[#77b944] hover:bg-[#f0fae8]'
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
					order={order}
				/>
			</div>
		</>
	);
};

export default LeaderboardPage;
