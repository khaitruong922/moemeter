import type { RankedUser } from '../api/users';
import UserRow from './UserRow';

type LeaderboardTableProps = {
	users: RankedUser[];
	loading?: boolean;
	currentUserId?: number;
};

export const LeaderboardTable = ({ users, loading, currentUserId }: LeaderboardTableProps) => {
	return (
		<div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 mx-2 sm:mx-4 w-full sm:w-3/4 max-w-[1200px]">
			<div className="bookmeter-green text-white px-4 sm:px-8 py-4 text-lg sm:text-xl font-bold">
				読書ランキング
			</div>
			<div className="overflow-x-auto">
				<table className="min-w-full text-xs sm:text-base">
					<thead className="bg-gray-50 border-b border-gray-200">
						<tr>
							<th className="px-2 sm:px-4 py-2 text-center font-semibold text-gray-500">順位</th>
							<th className="px-2 sm:px-4 py-2 text-center font-semibold text-gray-500">
								メンバー
							</th>
							<th className="px-2 sm:px-4 py-2 text-center font-semibold text-gray-500">
								読んだ本
							</th>
							<th className="px-2 sm:px-4 py-2 text-center font-semibold text-gray-500">
								読んだページ
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{loading ? (
							<tr>
								<td colSpan={4} className="py-8 text-center text-gray-400">
									<span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-300 mr-2 align-middle"></span>
									読書ランキングを読み込み中...
								</td>
							</tr>
						) : (
							users.map((user) => (
								<UserRow
									user={user}
									rank={user.rank}
									key={user.id}
									isCurrentUser={user.id === currentUserId}
								/>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};
