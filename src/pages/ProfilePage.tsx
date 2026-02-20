import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getUser, type RankedUser } from '../api/users';
import { getMetadata } from '../api/metadata';
import { UserAvatar } from '../components/UserAvatar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ProfileReadsTab, ProfileCommonReadersTab } from '../components/profile';
import { getUserBookmeterUrl } from '../utils/bookmeter';
import { getRankTextColorStyle } from '../utils/rank';
import { useDocumentTitle } from '../utils/useDocumentTitle';

type TabType = 'reads' | 'common-readers';

const ProfilePage = () => {
	useDocumentTitle('プロフィール | 萌メーター');
	const { id } = useParams<{ id: string }>();
	const userId = id ? parseInt(id) : undefined;
	const [activeTab, setActiveTab] = useState<TabType>('reads');

	const {
		data: user,
		isLoading: userLoading,
		error: userError,
	} = useQuery<RankedUser>({
		queryKey: ['user', userId],
		queryFn: () => getUser(userId!),
		enabled: !!userId,
	});

	const { data: metadata } = useQuery({ queryKey: ['metadata'], queryFn: getMetadata });

	if (!userId) return null;

	if (userLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="min-h-[50vh]">
					<LoadingSpinner message="読み込み中..." />
				</div>
			</div>
		);
	}

	if (userError || !user) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col items-center min-h-[50vh]">
					<p className="text-red-600">ユーザーが見つかりません</p>
				</div>
			</div>
		);
	}

	const tabs: { key: TabType; label: string }[] = [
		{ key: 'reads', label: '読書記録' },
		{ key: 'common-readers', label: '共読仲間' },
	];

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col lg:flex-row gap-6">
				{/* Fixed Profile Section */}
				<div className="lg:w-64 lg:flex-shrink-0">
					<div className="lg:sticky lg:top-[5.5rem] bg-white rounded-lg shadow p-6">
						<div className="flex flex-col items-center gap-2">
							<UserAvatar userId={user.id} name={user.name} avatarUrl={user.avatar_url} size="xl" />
							<a
								href={getUserBookmeterUrl(user.id)}
								target="_blank"
								rel="noopener noreferrer"
								className="text-xl font-semibold text-gray-700 hover:underline text-center"
							>
								{user.name}
							</a>
							<div className="text-center space-y-1 mt-2">
								<div className="text-sm">
									<span className="text-gray-500">読んだ本: </span>
									<span className="font-bold bookmeter-green-text">{user.books_read}冊</span>
									<span
										className={`ml-1 font-bold ${getRankTextColorStyle(user.rank, 'bookmeter-green-text')}`}
									>
										({user.rank}位)
									</span>
								</div>
								<div className="text-sm">
									<span className="text-gray-500">読んだページ: </span>
									<span className="font-bold bookmeter-green-text">
										{user.pages_read.toLocaleString()}
									</span>
									<span
										className={`ml-1 font-bold ${getRankTextColorStyle(user.pages_rank, 'bookmeter-green-text')}`}
									>
										({user.pages_rank}位)
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Main Content Area */}
				<div className="flex-1 min-w-0">
					{/* Tabs */}
					<div className="flex space-x-2 mb-6 flex-wrap gap-2">
						{tabs.map((tab) => (
							<button
								key={tab.key}
								onClick={() => setActiveTab(tab.key)}
								className={`px-4 py-2 rounded-lg cursor-pointer ${
									activeTab === tab.key
										? 'bookmeter-green text-white'
										: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
								}`}
							>
								{tab.label}
							</button>
						))}
					</div>

					{/* Tab Content - Keep both mounted to prevent reload */}
					<div className={activeTab === 'reads' ? '' : 'hidden'}>
						<ProfileReadsTab userId={userId} metadata={metadata} />
					</div>
					<div className={activeTab === 'common-readers' ? '' : 'hidden'}>
						<ProfileCommonReadersTab userId={userId} metadata={metadata} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
