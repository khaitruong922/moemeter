import { getProfileSummary } from '../api/users';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '../context/useUser';
import { UserAvatar } from '../components/UserAvatar';
import type { ReadSummary } from '../types/models';
import { getUserBookmeterUrl } from '../utils/bookmeter';
import { UserReadBookCover } from '../components/UserReadBookCover';
import { Link } from 'react-router-dom';
import { getRankTextColorStyle } from '../utils/rank';
const ProfilePage = () => {
	const { user } = useUser();
	const userId = user?.id;
	const { data, isLoading, error } = useQuery({
		queryKey: ['profile-summary', userId],
		queryFn: () => getProfileSummary(userId!, 2025),
		enabled: !!userId,
	});

	if (!userId) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
					<h2 className="text-xl font-bold mb-4 text-gray-800">
						プロファイルを見るにはログインが必要です
					</h2>
					<div className="flex justify-center space-x-4">
						<Link
							to="/login"
							className="px-6 py-2 rounded bookmeter-green-text bg-white border-2 border-[#77b944] cursor-pointer"
						>
							ログイン
						</Link>
					</div>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex flex-col items-center min-h-[70vh] w-full pt-10">
				<h2 className="text-2xl font-bold text-gray-800 mb-4">2025年まとめ</h2>
				<p className="text-gray-600">読み込み中...</p>
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="flex flex-col items-center min-h-[70vh] w-full pt-10">
				<h2 className="text-2xl font-bold text-gray-800 mb-4">2025年まとめ</h2>
				<p className="text-red-600">データ取得に失敗しました</p>
			</div>
		);
	}

	const { total_reads, total_pages, rank, peak_month, best_friend } = data;

	if (!peak_month || !best_friend) {
		return (
			<div className="flex flex-col items-center min-h-[70vh] w-full pt-10">
				<h2 className="text-2xl font-bold text-gray-800 mb-4">2025年まとめ</h2>
				<p className="text-gray-600">本を読まぬ者、まとめられぬ</p>
			</div>
		);
	}

	const bookCoverClassName = `block w-[calc(25%-0.5rem)] md:w-[calc(20%-0.5rem)]  xl:w-[calc(16.666%-0.5rem)]`;

	return (
		<div className="flex flex-col items-center w-full pt-10">
			<h2 className="text-2xl font-bold text-gray-800 mb-4">2025年まとめ</h2>
			<div className="mb-4 text-center flex flex-col items-center gap-1">
				<UserAvatar userId={user.id} name={user.name} avatarUrl={user.avatar_url} size="xl" />
				<div className="text-xl font-semibold text-gray-700 mt-2">{user.name}</div>
				<div
					className={`font-bold text-3xl ${getRankTextColorStyle(rank, 'bookmeter-green-text')}`}
				>
					{rank}位
				</div>
				<span className="text-md">
					<span className="text-gray-700">読んだ本: </span>
					<span className="font-bold bookmeter-green-text">{total_reads}冊</span>
				</span>
				<span className="text-md">
					<span className="text-gray-700">読んだページ: </span>
					<span className="font-bold bookmeter-green-text">{total_pages}</span>
				</span>
			</div>
			<div className="w-full max-w-7xl px-4 mb-8">
				<div className="flex flex-col gap-4 md:flex-row">
					<div className="p-4 bg-white rounded-lg shadow flex-1 md:self-start">
						<h3 className="text-xl font-semibold text-gray-700 mb-2">ベスト月</h3>
						<div className="flex items-center gap-4 mb-4 justify-between h-16">
							<div className="flex-none w-16 text-center">
								<div className="text-2xl font-bold bookmeter-green-text">{peak_month.month}</div>
								<div className="text-sm text-gray-500">月</div>
							</div>
							<div className="text-xl text-gray-600">
								<span className="font-bold bookmeter-green-text">{peak_month.reads.length}冊</span>
							</div>
						</div>
						<div className="flex flex-wrap gap-2 mt-4">
							{peak_month.reads.map((read: ReadSummary) => (
								<UserReadBookCover
									key={read.read_id}
									bookId={read.id}
									title={read.title}
									thumbnailUrl={read.thumbnail_url}
									customClassName={bookCoverClassName}
								/>
							))}
						</div>
					</div>

					<div className="p-4 bg-white rounded-lg shadow flex-1 md:self-start">
						<h3 className="text-xl font-semibold text-gray-700 mb-2">ベストフレンド</h3>
						<div className="flex items-center gap-4 mb-4 justify-between h-16">
							<div className="flex flex-row items-center gap-4">
								<UserAvatar
									userId={best_friend.user.id}
									name={best_friend.user.name}
									avatarUrl={best_friend.user.avatar_url}
									size="md"
								/>
								<a
									href={getUserBookmeterUrl(best_friend.user.id)}
									target="_blank"
									rel="noopener noreferrer"
									className="text-xl font-semibold bookmeter-green-text hover:underline"
								>
									{best_friend.user.name}
								</a>
							</div>
							<div className="text-xl text-gray-600">
								<span className="font-bold bookmeter-green-text">{best_friend.reads.length}冊</span>
							</div>
						</div>
						<div className="flex flex-wrap gap-2 mt-4">
							{best_friend.reads.map((read: ReadSummary) => (
								<UserReadBookCover
									key={read.read_id}
									bookId={read.id}
									title={read.title}
									thumbnailUrl={read.thumbnail_url}
									customClassName={bookCoverClassName}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
