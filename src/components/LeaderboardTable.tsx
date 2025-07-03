import type { User } from '../types/models';
import UserRow from './UserRow';

type LeaderboardTableProps = {
	users: User[];
};

export const LeaderboardTable = ({ users }: LeaderboardTableProps) => {
	return (
		<div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
			<div className="bookmeter-green text-white px-6 py-3 text-lg font-bold">読書ランキング</div>
			<table className="min-w-full">
				<thead className="bg-gray-50 border-b border-gray-200">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							順位
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							ユーザー
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							読んだ本
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							読んだページ
						</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{users.map((user, index) => (
						<UserRow user={user} rank={index + 1} />
					))}
				</tbody>
			</table>
		</div>
	);
};
