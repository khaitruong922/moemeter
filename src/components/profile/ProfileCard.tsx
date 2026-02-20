import { UserAvatar } from '../UserAvatar';
import { getUserBookmeterUrl } from '../../utils/bookmeter';
import { getRankTextColorStyle } from '../../utils/rank';
import type { RankedUser } from '../../api/users';

interface ProfileCardProps {
	user: RankedUser;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
	const bookmeterUrl = getUserBookmeterUrl(user.id);

	return (
		<div className="lg:w-64 lg:flex-shrink-0">
			<div className="lg:sticky lg:top-[5.5rem] bg-white rounded-lg shadow p-6">
				<div className="flex flex-col items-center gap-1">
					<UserAvatar userId={user.id} name={user.name} avatarUrl={user.avatar_url} size="xl" />
					<a
						href={bookmeterUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-3 text-xl font-semibold text-gray-700 hover:underline text-center"
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
					<a
						href={bookmeterUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-4 text-md bookmeter-green-text hover:underline flex items-center gap-1"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M.678 14.262h6.089V24H.678v-9.738zm8.215 9.717h6.089V7.11H8.893v16.869zM17.234 0v24h6.089V0h-6.089z" />
						</svg>
						<span className="ml-1">読書メーター</span>
					</a>
				</div>
			</div>
		</div>
	);
};
