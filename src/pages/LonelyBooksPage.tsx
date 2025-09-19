import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getLonelyBooks } from '../api/users';
import { LonelyBookCard } from '../components/LonelyBookCard';
import { ENABLE_JOIN_GROUP } from '../constants';
import { useUser } from '../context/useUser';
import type { LonelyBooksResponse } from '../types/models';
import { formatDatetime } from '../utils/datetime';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { getMetadata } from '../api/metadata';


const LonelyBooksPage = () => {
	useDocumentTitle('ひとりぼっち本 | 萌メーター');
	const { user } = useUser();
	const userId = user?.id;

	const { data, isLoading, error } = useQuery<LonelyBooksResponse>({
		enabled: !!userId,
		queryKey: ['lonelyBooks', userId],
		queryFn: () => getLonelyBooks(userId!),
	});
	const { data: metadata } = useQuery({ queryKey: ['metadata'], queryFn: getMetadata });

	if (!user) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
					<h2 className="text-xl font-bold mb-4 text-gray-800">ひとりぼっち本を見るにはログインが必要です</h2>
					<p className="text-gray-600 mb-6">
						ひとりぼっち本機能を利用するには、ログイン{ENABLE_JOIN_GROUP ? 'またはグループへの参加' : ''}
						が必要です。
					</p>
					<div className="flex justify-center space-x-4">
						<Link
							to="/login"
							className="px-6 py-2 rounded bookmeter-green-text bg-white border-2 border-[#77b944] cursor-pointer"
						>
							ログイン
						</Link>
						{ENABLE_JOIN_GROUP && (
							<Link
								to="/join"
								className="px-6 py-2 rounded bookmeter-green text-white hover:bg-[#69a73c] transition-colors duration-200 cursor-pointer"
							>
								グループに参加
							</Link>
						)}
					</div>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex flex-col justify-center items-center min-h-[70vh]">
				<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-4"></div>
				<div className="text-gray-400 text-sm">ひとりぼっち本データを読み込み中...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-[70vh] text-red-600">
				エラーが発生しました
			</div>
		);
	}

	if (!data) return null;

	const { books } = data;


	return (
		<>
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				<div className="w-full max-w-4xl mx-auto divide-y divide-gray-200">
					{books.length === 0 && (
						<div className="text-center text-gray-500">ひとりぼっち本はありません</div>
					)}
					{books.map((book, index) => (
						<LonelyBookCard key={book.id} book={book} index={index + 1} />
					))}
				</div>
				<p className="mt-4 text-center text-xs text-gray-400">
					最終更新: {formatDatetime(metadata?.last_updated)}
					{typeof metadata?.total_users === 'number' &&
						typeof metadata?.failed_users === 'number' && (
							<span className="ml-2">
								同期済み: {metadata.total_users - metadata.failed_users}/{metadata.total_users}人
							</span>
						)}
				</p>
			</div>
		</>
	);
};

export default LonelyBooksPage;

