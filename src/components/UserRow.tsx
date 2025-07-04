import type { User } from '../types/models';
import { getUserBookmeterUrl } from '../utils/bookmeter';
import { getRankTextColorStyle } from '../utils/rank';
import { UserAvatar } from './UserAvatar';

type Props = {
	user: User;
	rank: number;
};

const UserRow = ({ user, rank }: Props) => {
	const bookmeterUrl = getUserBookmeterUrl(user.id);

	return (
		<tr className="hover:bg-gray-50 align-middle">
			<td
				className={`px-4 py-2 whitespace-nowrap text-base font-semibold text-center ${getRankTextColorStyle(rank)}`}
			>
				{rank}位
			</td>
			<td className="px-4 py-2 whitespace-nowrap">
				<div className="flex items-center align-start">
					<div className="flex-shrink-0 w-8 h-8 sm:w-8 sm:h-8">
						<UserAvatar userId={user.id} name={user.name} avatarUrl={user.avatar_url} size="sm" />
					</div>
					<div className="ml-2 sm:ml-4 min-w-0">
						<div className="text-base font-semibold text-gray-900 truncate">
							<a
								href={bookmeterUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="bookmeter-link hover:underline"
							>
								{user.name ?? '匿名'}
							</a>
						</div>
					</div>
				</div>
			</td>
			<td className="px-4 py-2 whitespace-nowrap text-center text-base font-bold bookmeter-green-text">
				{user.books_read ?? 0}冊
			</td>
			<td className="px-4 py-2 whitespace-nowrap text-base text-gray-700 text-center">
				{user.pages_read?.toLocaleString() ?? 0}
			</td>
		</tr>
	);
};

export default UserRow;
