import type { User } from '../types/models';
import UserRow from './UserRow';

type LeaderboardTableProps = {
	users: User[];
};

export const LeaderboardTable = ({ users }: LeaderboardTableProps) => {
	return (
		<div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mx-4 w-3/4 max-w-[1200px]">
			<div className="bookmeter-green text-white px-8 py-4 text-xl font-bold">読書ランキング</div>
			<table className="min-w-full">
				<thead className="bg-gray-50 border-b border-gray-200">
					<tr>
						<th className="px-4 py-2 text-center text-sm font-semibold text-gray-500">順位</th>
						<th className="px-4 py-2 text-center text-sm font-semibold text-gray-500">ユーザー</th>
						<th className="px-4 py-2 text-center text-sm font-semibold text-gray-500">読んだ本</th>
						<th className="px-4 py-2 text-center text-sm font-semibold text-gray-500">
							読んだページ
						</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{users.map((user, index) => (
						<UserRow user={user} rank={index + 1} key={user.id} />
					))}
				</tbody>
			</table>
		</div>
	);
};
