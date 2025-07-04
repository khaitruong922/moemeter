import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getGroups, type Group } from '../api/groups';
import { joinGroup } from '../api/users';
import { extractUserIdFromBookmeterUrl } from '../utils/bookmeter';
import { useUser } from '../context/userContext';
import { ENABLE_JOIN_GROUP } from '../constants';

export default function JoinPage() {
	const navigate = useNavigate();
	const [userInput, setUserInput] = useState('');
	const [selectedGroup, setSelectedGroup] = useState<number | ''>('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const { setUser } = useUser();
	const { data: groups, isLoading: isLoadingGroups } = useQuery({
		queryKey: ['groups'],
		queryFn: getGroups,
	});
	const queryClient = useQueryClient();
	const joinMutation = useMutation({
		mutationFn: joinGroup,
		onSuccess: (response) => {
			setError(null);
			setUser(response.user);
			queryClient.removeQueries();
			navigate('/leaderboard');
		},
		onError: (error) => {
			setError(error instanceof Error ? error.message : 'ユーザーが見つかりませんでした');
		},
	});
	useEffect(() => {
		if (!ENABLE_JOIN_GROUP) {
			navigate('/leaderboard');
		}
	}, [navigate]);
	useEffect(() => {
		if (groups && groups.length > 0 && !selectedGroup) {
			setSelectedGroup(groups[0].id);
		}
	}, [groups, selectedGroup]);
	if (!ENABLE_JOIN_GROUP) {
		return null;
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		const userId = extractUserIdFromBookmeterUrl(userInput);
		if (!userId) {
			setError('ユーザーIDまたはブクメーターURLが無効です');
			return;
		}

		if (!selectedGroup) {
			setError('グループを選択してください');
			return;
		}

		if (!password) {
			setError('グループパスワードを入力してください');
			return;
		}

		joinMutation.mutate({
			user_id: userId,
			group_id: selectedGroup,
			password,
		});
	};

	if (isLoadingGroups) {
		return <div className="p-8 text-center text-gray-600">グループ情報を読み込み中...</div>;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
				<h1 className="text-2xl font-bold mb-6 text-center text-gray-800">グループに参加</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="userId"
							className="block text-sm font-medium text-gray-700 mb-1 text-left"
						>
							ユーザーIDまたはブクメーターURL
						</label>
						<input
							id="userId"
							type="text"
							value={userInput}
							onChange={(e) => setUserInput(e.target.value)}
							placeholder="ユーザーIDまたはブクメーターURL"
							className="w-full py-2 px-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
							required
						/>
						<p className="mt-2 text-xs text-gray-500 text-left">
							例：https://bookmeter.com/users/123456 または 123456
						</p>
					</div>

					<div>
						<label
							htmlFor="group"
							className="block text-sm font-medium text-gray-700 mb-1 text-left"
						>
							グループを選択
						</label>
						<select
							id="group"
							value={selectedGroup}
							onChange={(e) => setSelectedGroup(Number(e.target.value))}
							className="w-full py-2 px-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
							required
						>
							<option value="">グループを選択...</option>
							{groups?.map((group: Group) => (
								<option key={group.id} value={group.id}>
									{group.name}
								</option>
							))}
						</select>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700 mb-1 text-left"
						>
							グループパスワード
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full py-2 px-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
							required
						/>
					</div>

					{error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</div>}

					<button
						type="submit"
						disabled={joinMutation.isPending}
						className="w-full bookmeter-green text-white py-3 px-4 rounded-lg hover:bg-[#69a73c] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
					>
						{joinMutation.isPending ? <span>データをインポート中...</span> : 'グループに参加する'}
					</button>
				</form>

				{joinMutation.isPending && (
					<div className="mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded ">
						<p className="font-medium mb-1">注意</p>
						<p>
							<span className="animate-fade-in">
								初回参加時はユーザーおよび読書データのインポートが必要なため、処理に時間がかかる場合があります。
								しばらくお待ちください。
							</span>
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
