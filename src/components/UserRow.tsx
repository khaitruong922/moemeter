import { Link } from 'react-router-dom';
import type { User } from '../types/models';
import { getRankTextColorStyle } from '../utils/rank';
import { UserAvatar } from './UserAvatar';

type Props = {
	user: User;
	rank: number;
	isCurrentUser?: boolean;
};

const UserRow = ({ user, rank, isCurrentUser }: Props) => {
	const profileUrl = '/profile?user_id=' + user.id;
	const booksRead = user.books_read ?? 0;

	return (
		<tr
			className={`align-middle ${isCurrentUser ? 'bg-[#f0fae8] hover:bg-[#e6f7d9]' : 'hover:bg-gray-50'}`}
		>
			<td
				className={`text-base px-2 sm:px-4 py-2 whitespace-nowrap font-semibold text-center ${getRankTextColorStyle(rank)}`}
			>
				{booksRead === 0 ? (
					<img src="/read.png" alt="read" className="inline-block w-8 h-8" />
				) : (
					`${rank}位`
				)}
			</td>
			<td className="px-2 sm:px-4 py-2 whitespace-nowrap">
				<div className="flex items-center align-start">
					<div className="flex-shrink-0">
						<UserAvatar
							userId={user.id}
							name={user.name}
							avatarUrl={user.avatar_url}
							size="sm"
							toProfile
						/>
					</div>
					<div className="ml-2 sm:ml-4 min-w-0">
						<div className="text-base font-bold text-gray-900 bookmeter-green-text truncate">
							<Link to={profileUrl} rel="noopener noreferrer" className="hover:underline">
								{user.name ?? '匿名'}
							</Link>
						</div>
					</div>
				</div>
			</td>
			<td className="text-base font-bold px-2 sm:px-4 py-2 whitespace-nowrap text-center bookmeter-green-text">
				{booksRead}冊
			</td>
			<td className="text-base font-medium px-2 sm:px-4 py-2 whitespace-nowrap text-gray-700 text-center">
				{user.pages_read?.toLocaleString() ?? 0}
			</td>
		</tr>
	);
};

export default UserRow;
