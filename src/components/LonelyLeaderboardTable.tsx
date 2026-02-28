import type { LonelyUser, LonelyOrder } from '../api/users';
import LonelyUserRow from './LonelyUserRow';
import { Tooltip } from './Tooltip';

type LonelyLeaderboardTableProps = {
	users: LonelyUser[];
	loading?: boolean;
	currentUserId?: number;
	order: LonelyOrder;
};

export const LonelyLeaderboardTable = ({
	users,
	loading,
	currentUserId,
	order,
}: LonelyLeaderboardTableProps) => {
	return (
		<div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 mx-2 sm:mx-4 w-full md:w-3/4 max-w-[1200px]">
			<div className="overflow-x-auto">
				<table className="min-w-full text-xs sm:text-base">
					<thead className="bookmeter-green text-white text-center font-semibold text-sm md:text-base">
						<tr>
							<th className="px-1 sm:px-4 py-2">順位</th>
							<th className="px-1 sm:px-4 py-2">メンバー</th>
							<th className="px-1 sm:px-4 py-2 relative">
								<span>ぼっち本</span>
								<Tooltip>
									<p>そのメンバーだけが読んだ本</p>
								</Tooltip>
							</th>
							<th className="px-1 sm:px-4 py-2 relative">
								<span>ぼっちポ日</span>
								<Tooltip>
									<p className="mb-2">すべてのぼっち本の読了日からの経過日数の合計</p>
									<p className="text-gray-500 text-[10px] mt-1">
										※読んだ日が不明な本は計算に含まれません
									</p>
								</Tooltip>
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{loading ? (
							<tr>
								<td colSpan={4} className="py-8 text-center text-gray-400">
									<span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-300 mr-2 align-middle"></span>
									ぼっちランキングを読み込み中...
								</td>
							</tr>
						) : (
							users.map((user) => (
								<LonelyUserRow
									user={user}
									order={order}
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
