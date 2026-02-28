import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getUser, type RankedUser } from '../api/users';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ProfileReadsTab, ProfileFriendsTab, ProfileCard } from '../components/profile';
import { useDocumentTitle } from '../utils/useDocumentTitle';

type TabType = 'reads' | 'lonely-books' | 'friends';

const getTabFromPath = (pathname: string): TabType => {
	if (pathname.endsWith('/lonely-books')) return 'lonely-books';
	if (pathname.endsWith('/friends')) return 'friends';
	return 'reads';
};

const getTabLabel = (tab: TabType): string => {
	switch (tab) {
		case 'reads':
			return '読んだ本';
		case 'lonely-books':
			return 'ひとりぼっち本';
		case 'friends':
			return '読書仲間';
	}
};

const ProfilePage = () => {
	const { id } = useParams<{ id: string }>();
	const location = useLocation();
	const userId = id ? parseInt(id) : undefined;
	const activeTab = getTabFromPath(location.pathname);

	const {
		data: user,
		isLoading: userLoading,
		error: userError,
	} = useQuery<RankedUser>({
		queryKey: ['user', userId],
		queryFn: () => getUser(userId!),
		enabled: !!userId,
	});

	// Set document title dynamically based on user and tab
	const documentTitle =
		user && user.name ? `${user.name} | ${getTabLabel(activeTab)} | 萌メーター` : undefined;
	useDocumentTitle(documentTitle);

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

	const tabs: { key: TabType; label: string; path: string }[] = [
		{ key: 'reads', label: '読んだ本', path: `/profile/${userId}` },
		{ key: 'lonely-books', label: 'ひとりぼっち本', path: `/profile/${userId}/lonely-books` },
		{ key: 'friends', label: '読書仲間', path: `/profile/${userId}/friends` },
	];

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col lg:flex-row gap-6">
				{/* Profile Card */}
				<ProfileCard user={user} />

				{/* Main Content Area */}
				<div className="flex-1 min-w-0">
					{/* Tabs */}
					<div className="flex space-x-1 sm:space-x-2 mb-4 flex-wrap gap-1">
						{tabs.map((tab) => (
							<Link
								key={tab.key}
								to={tab.path}
								className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base ${
									activeTab === tab.key
										? 'bookmeter-green text-white'
										: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
								}`}
							>
								{tab.label}
							</Link>
						))}
					</div>

					{/* Tab Content */}
					{activeTab === 'reads' && <ProfileReadsTab userId={userId} pageType="reads" />}
					{activeTab === 'lonely-books' && (
						<ProfileReadsTab userId={userId} pageType="lonely_books" />
					)}
					{activeTab === 'friends' && <ProfileFriendsTab userId={userId} />}
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
