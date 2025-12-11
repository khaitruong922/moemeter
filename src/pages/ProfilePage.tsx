import { getProfileSummary } from '../api/users';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '../context/useUser';
import { UserAvatar } from '../components/UserAvatar';
import { BookCover } from '../components/BookCover';
import type { ReadSummary } from '../types/models';
import { getUserBookmeterUrl } from '../utils/bookmeter';
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
			<div className="flex flex-col items-center min-h-[70vh] w-full pt-10">
				<h2 className="text-2xl font-bold text-gray-800 mb-4">プロフィール</h2>
				<p className="text-gray-600">ユーザー情報がありません。</p>
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

	const { total_reads, total_pages, peak_month, best_friend } = data;

	if (!peak_month || !best_friend) {
		return (
			<div className="flex flex-col items-center min-h-[70vh] w-full pt-10">
				<h2 className="text-2xl font-bold text-gray-800 mb-4">2025年まとめ</h2>
				<p className="text-gray-600">本を読まぬ者、まとめられず</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center min-h-[70vh] w-full pt-10">
			<h2 className="text-2xl font-bold text-gray-800 mb-2">2025年まとめ</h2>
			<div className="mb-4 text-center flex flex-row items-center gap-4">
				<div className="flex items-center justify-center gap-3 mb-4">
					<UserAvatar userId={user.id} name={user.name} avatarUrl={user.avatar_url} size="xl" />
					<div className="text-lg font-semibold text-gray-700">{user.name}</div>
				</div>
				<div className="mb-6 flex flex-col items-center gap-2">
					<div className="text-sm text-gray-600">
						読書数: <span className="font-bold bookmeter-green-text">{total_reads}</span>
					</div>
					<div className="text-sm text-gray-600">
						総ページ数: <span className="font-bold bookmeter-green-text">{total_pages}</span>
					</div>
				</div>
			</div>
			<div className="w-full max-w-6xl px-4 mb-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div>
						<h3 className="text-base font-bold text-gray-800 mb-4">
							ベスト月: {peak_month.month}月
						</h3>
						<div className="mb-4 flex flex-col gap-2">
							<div className="text-sm text-gray-600">
								総本数:{' '}
								<span className="font-bold bookmeter-green-text">{peak_month.reads.length}</span>
							</div>
							<div className="text-sm text-gray-600">
								総ページ数:{' '}
								<span className="font-bold bookmeter-green-text">
									{peak_month.reads.reduce((sum, read) => sum + read.page, 0)}
								</span>
							</div>
						</div>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
							{peak_month.reads.map((read: ReadSummary) => (
								<BookCover
									key={read.read_id}
									bookId={read.id}
									title={read.title}
									thumbnailUrl={read.thumbnail_url}
								/>
							))}
						</div>
					</div>

					<div>
						<h3 className="text-base font-bold text-gray-800 mb-4">ベストフレンド</h3>
						<div className="flex items-center gap-3 mb-4">
							<UserAvatar
								userId={best_friend.user.id}
								name={best_friend.user.name}
								avatarUrl={best_friend.user.avatar_url}
								size="md"
							/>
							<div className="flex-grow flex flex-col items-start">
								<a
									href={getUserBookmeterUrl(best_friend.user.id)}
									target="_blank"
									rel="noopener noreferrer"
								>
									<h3 className="text-base sm:text-lg font-semibold bookmeter-green-text">
										{best_friend.user.name}
									</h3>
								</a>
							</div>
						</div>
						<div className="mb-4 flex flex-row gap-2">
							<div className="text-sm text-gray-600">
								共読本数:{' '}
								<span className="font-bold bookmeter-green-text">{best_friend.reads.length}</span>
							</div>
							<div className="text-sm text-gray-600">
								共読ページ数:{' '}
								<span className="font-bold bookmeter-green-text">
									{best_friend.reads.reduce((sum, read) => sum + read.page, 0)}
								</span>
							</div>
						</div>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
							{best_friend.reads.map((read: ReadSummary) => (
								<BookCover
									key={read.read_id}
									bookId={read.id}
									title={read.title}
									thumbnailUrl={read.thumbnail_url}
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
