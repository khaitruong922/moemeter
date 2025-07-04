import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../api/users';
import { extractUserIdFromBookmeterUrl } from '../utils/bookmeter';
import { useUser } from '../context/userContext';
import { useDocumentTitle } from '../utils/useDocumentTitle';

const LoginPage = () => {
	const [userInput, setUserInput] = useState('');
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const { setUser } = useUser();

	useDocumentTitle('ログイン | 読書メーター Plus');

	const loginMutation = useMutation({
		mutationFn: getUser,
		onSuccess: (user) => {
			setError(null);
			setUser(user);
			navigate('/leaderboard');
		},
		onError: (error) => {
			setError(error instanceof Error ? error.message : 'ユーザーが見つかりませんでした');
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		const userId = extractUserIdFromBookmeterUrl(userInput);
		if (!userId) {
			setError('ブクメーターURLまたはユーザーIDが無効です');
			return;
		}

		loginMutation.mutate(userId);
	};

	return (
		<>
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
					<h1 className="text-2xl font-bold mb-6 text-center text-gray-800">ログイン</h1>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label
								htmlFor="userId"
								className="block text-sm font-medium text-gray-700 mb-1 text-left"
							>
								ブクメーターURLまたはユーザーID
							</label>
							<input
								id="userId"
								type="text"
								value={userInput}
								onChange={(e) => setUserInput(e.target.value)}
								placeholder="ブクメーターURLまたはユーザーID"
								className="w-full py-2 px-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
								required
							/>
							<p className="mt-2 text-xs text-gray-500 text-left">
								例：https://bookmeter.com/users/123456 または 123456
							</p>
						</div>

						{error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</div>}

						<button
							type="submit"
							disabled={loginMutation.isPending}
							className="w-full bookmeter-green text-white py-3 px-4 rounded-lg hover:bg-[#69a73c] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
						>
							{loginMutation.isPending ? 'ログイン中...' : 'ログイン'}
						</button>
					</form>
				</div>
			</div>
		</>
	);
};

export default LoginPage;
