import type { User } from '../types/models';
import UserAvatar from './UserAvatar';

type Props = {
	user: User;
	rank: number;
};

const UserRow = ({ user, rank }: Props) => {
	return (
		<tr className="hover:bg-gray-50">
			<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rank}位</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<div className="flex items-center">
					<UserAvatar avatarUrl={user.avatar_url} name={user.name} />
					<div className="ml-4">
						<div className="text-sm font-medium text-gray-900">
							<a
								href={`https://bookmeter.com/users/${user.id}`}
								target="_blank"
								rel="noopener noreferrer"
								className="bookmeter-link hover:underline"
							>
								{user.name ?? '匿名'}
							</a>
						</div>
						{user.bookmeter_url && (
							<a href={user.bookmeter_url} target="_blank" className="bookmeter-link text-sm">
								プロフィール
							</a>
						)}
					</div>
				</div>
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<span className="px-2 inline-flex text-sm font-medium bookmeter-green-text">
					{user.books_read ?? 0}冊
				</span>
			</td>
			<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
				{user.pages_read?.toLocaleString() ?? 0}
			</td>
		</tr>
	);
};

export default UserRow;
