import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getLonelyLeaderboard, type LonelyOrder } from '../api/users';
import { SectionHeader } from '../components/SectionHeader';
import LonelyUserRow from '../components/LonelyUserRow';
import { useUser } from '../context/useUser';
import { useDocumentTitle } from '../utils/useDocumentTitle';

const LonelyLeaderboardPage = () => {
	useDocumentTitle('ぼっちランキング | 萌メーター');
	const [searchParams, setSearchParams] = useSearchParams();

	// Load from localStorage first, then URL params, then defaults
	const getInitialOrder = (): LonelyOrder => {
		const urlOrder = searchParams.get('order');
		if (urlOrder === 'points' || urlOrder === 'book_count') return urlOrder;
		const stored = localStorage.getItem('lonely_leaderboard_order');
		if (stored === 'points' || stored === 'book_count') return stored;
		return 'points';
	};

	const [order, setOrder] = useState<LonelyOrder>(getInitialOrder());
	const [showTooltip, setShowTooltip] = useState(false);

	// Sync state with URL parameters and localStorage
	useEffect(() => {
		const urlOrder = searchParams.get('order');
		if (urlOrder === 'points' || urlOrder === 'book_count') {
			setOrder(urlOrder);
			localStorage.setItem('lonely_leaderboard_order', urlOrder);
		} else {
			const storedOrder = localStorage.getItem('lonely_leaderboard_order');
			if (storedOrder === 'points' || storedOrder === 'book_count') {
				setOrder(storedOrder);
			}
		}
	}, [searchParams]);

	const { user: currentUser } = useUser();

	const { data: usersData, isLoading } = useQuery({
		queryKey: ['lonelyLeaderboard', order],
		queryFn: () => getLonelyLeaderboard(order),
	});

	const users = usersData || [];
	const total_count = usersData?.length || 0;

	const totalBooks = users.reduce((sum, user) => {
		const count =
			typeof user.lonely_book_count === 'string'
				? parseInt(user.lonely_book_count)
				: user.lonely_book_count;
		return sum + count;
	}, 0);

	const totalPoints = users.reduce((sum, user) => {
		const points =
			typeof user.lonely_points === 'string' ? parseInt(user.lonely_points) : user.lonely_points;
		return sum + points;
	}, 0);

	return (
		<>
			<div className="flex flex-col items-center min-h-[70vh] w-full py-10">
				<div className="mx-2 sm:mx-4 w-full md:w-3/4 max-w-[1200px] mb-6">
					<div className="flex space-x-1 sm:space-x-2 flex-wrap gap-1">
						<Link
							to="/lonely-leaderboard"
							className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base bookmeter-green text-white"
						>
							ぼっちランキング
						</Link>
					</div>
				</div>

				<SectionHeader
					title="ぼっちランキング"
					count={
						isLoading
							? undefined
							: `${total_count}人 | ${totalBooks.toLocaleString()}冊 | ${totalPoints.toLocaleString()}ポイント`
					}
					isLoading={isLoading}
					loadingMessage="読み込み中..."
				/>

				<div className="mx-2 sm:mx-4 w-full md:w-3/4 max-w-[1200px] mb-6">
					<div className="flex items-start justify-end">
						<div className="flex rounded-lg overflow-hidden border border-[#77b944]/20">
							<button
								type="button"
								onClick={() => {
									setOrder('book_count');
									localStorage.setItem('lonely_leaderboard_order', 'book_count');
									setSearchParams({ order: 'book_count' });
								}}
								className={`text-sm sm:text-base py-2 px-4 sm:px-6 font-medium transition-colors cursor-pointer ${
									order === 'book_count'
										? 'bookmeter-green text-white'
										: 'bg-white text-[#77b944] hover:bg-[#f0fae8]'
								}`}
							>
								冊数順
							</button>
							<button
								type="button"
								onClick={() => {
									setOrder('points');
									localStorage.setItem('lonely_leaderboard_order', 'points');
									setSearchParams({ order: 'points' });
								}}
								className={`text-sm sm:text-base py-2 px-4 sm:px-6 font-medium transition-colors cursor-pointer border-l border-[#77b944]/20 ${
									order === 'points'
										? 'bookmeter-green text-white'
										: 'bg-white text-[#77b944] hover:bg-[#f0fae8]'
								}`}
							>
								ポイント順
							</button>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 mx-2 sm:mx-4 w-full md:w-3/4 max-w-[1200px]">
					<div className="overflow-x-auto">
						<table className="min-w-full text-xs sm:text-base">
							<thead className="bookmeter-green text-white text-center font-semibold text-sm md:text-base">
								<tr>
									<th className="px-2 sm:px-4 py-2">順位</th>
									<th className="px-2 sm:px-4 py-2">メンバー</th>
									<th className="px-2 sm:px-4 py-2">ぼっち本</th>
									<th className="px-2 sm:px-4 py-2 relative">
										<span>ぼっちポイント</span>
										<button
											type="button"
											onMouseEnter={() => setShowTooltip(true)}
											onMouseLeave={() => setShowTooltip(false)}
											onClick={() => setShowTooltip(!showTooltip)}
											className="ml-1 inline-flex items-center justify-center w-4 h-4 text-xs border border-white rounded-full hover:bg-white/20 transition-colors"
										>
											?
										</button>
										{showTooltip && (
											<div className="absolute top-full right-0 mt-2 w-64 p-3 bg-white text-gray-700 text-xs text-left rounded-lg shadow-lg border border-gray-200 z-10">
												<p className="font-semibold mb-1">ぼっちポイントとは？</p>
												<p className="mb-2">全てのぼっち本のポイントの合計です。</p>
												<p className="text-gray-600">1冊のポイント = 今日 - 読んだ日 + 1</p>
												<p className="text-gray-500 text-[10px] mt-1">
													※読んだ日が不明な本は計算に含まれません
												</p>
											</div>
										)}
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{isLoading ? (
									<tr>
										<td colSpan={4} className="py-8 text-center text-gray-400">
											<span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-300 mr-2 align-middle"></span>
											ぼっちランキングを読み込み中...
										</td>
									</tr>
								) : (
									users.map((user) => (
										<LonelyUserRow
											user={user}
											order={order}
											key={user.id}
											isCurrentUser={user.id === currentUser?.id}
										/>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
};

export default LonelyLeaderboardPage;
