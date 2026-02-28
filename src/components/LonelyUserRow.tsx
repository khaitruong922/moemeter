import { Link } from 'react-router-dom';
import type { LonelyUser, LonelyOrder } from '../api/users';
import { getRankTextColorStyle } from '../utils/rank';
import { UserAvatar } from './UserAvatar';

type Props = {
	user: LonelyUser;
	order: LonelyOrder;
	isCurrentUser?: boolean;
};

const LonelyUserRow = ({ user, order, isCurrentUser }: Props) => {
	const profileUrl = `/profile/${user.id}`;
	const lonelyBookCount =
		typeof user.lonely_book_count === 'string'
			? parseInt(user.lonely_book_count)
			: user.lonely_book_count;
	const lonelyDays =
		typeof user.lonely_days === 'string' ? parseInt(user.lonely_days) : user.lonely_days;
	const nullReadDateCount =
		typeof user.null_read_date_count === 'string'
			? parseInt(user.null_read_date_count)
			: user.null_read_date_count;

	const rank =
		order === 'book_count'
			? typeof user.book_count_rank === 'string'
				? parseInt(user.book_count_rank)
				: user.book_count_rank
			: typeof user.days_rank === 'string'
				? parseInt(user.days_rank)
				: user.days_rank;

	return (
		<tr
			className={`align-middle ${isCurrentUser ? 'bg-[#f0fae8] hover:bg-[#e6f7d9]' : 'hover:bg-gray-50'}`}
		>
			<td
				className={`text-sm sm:text-base px-1 sm:px-4 py-2 whitespace-nowrap font-semibold text-center ${getRankTextColorStyle(rank)}`}
			>
				{lonelyBookCount === 0 ? (
					<img src="/read.png" alt="read" className="inline-block w-8 h-8" />
				) : (
					`${rank}位`
				)}
			</td>
			<td className="px-1 sm:px-4 py-2 whitespace-nowrap">
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
						<div className="text-sm sm:text-base font-bold text-gray-900 bookmeter-green-text truncate">
							<Link to={profileUrl} rel="noopener noreferrer" className="hover:underline">
								{user.name ?? '匿名'}
							</Link>
						</div>
					</div>
				</div>
			</td>
			<td className="text-sm sm:text-base font-bold px-1 sm:px-4 py-2 whitespace-nowrap text-center bookmeter-green-text">
				{lonelyBookCount}冊
			</td>
			<td className="text-sm sm:text-base font-medium px-1 sm:px-4 py-2 whitespace-nowrap text-gray-700 text-center">
				<div>{lonelyDays.toLocaleString()}</div>
				{nullReadDateCount > 0 && (
					<div className="text-xs text-gray-500 mt-1">+{nullReadDateCount}冊(日付不明)</div>
				)}
			</td>
		</tr>
	);
};

export default LonelyUserRow;
