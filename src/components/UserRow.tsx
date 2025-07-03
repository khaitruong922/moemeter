import type { User } from '../types/models';
import { getUserBookmeterUrl } from '../utils/bookmeter';
import { UserAvatar } from './UserAvatar';

type Props = {
	user: User;
	rank: number;
};

const UserRow = ({ user, rank }: Props) => {
	const bookmeterUrl = getUserBookmeterUrl(user.id);
	return (
		<tr className="hover:bg-gray-50 align-middle">
			<td className="px-4 py-2 whitespace-nowrap text-base font-semibold text-gray-900 text-center">
				{rank}位
			</td>
			<td className="px-4 py-2 whitespace-nowrap">
				<div className="flex items-center align-start">
					<UserAvatar userId={user.id} name={user.name} avatarUrl={user.avatar_url} size="sm" />
					<div className="ml-4">
						<div className="text-base font-semibold text-gray-900">
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
