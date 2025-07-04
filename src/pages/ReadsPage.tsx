import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCommonReads } from '../api/users';
import type { Book, User } from '../types/models';
import { TabButton } from '../components/TabButton';
import { UserReadCard } from '../components/UserReadCard';
import { BookReadCard } from '../components/BookReadCard';
import { useUser } from '../context/userContext';
import { Link } from 'react-router-dom';
import { ENABLE_JOIN_GROUP } from '../constants';

type TabType = 'users' | 'books';

interface UserReadCount {
	user: User;
	readCount: number;
	commonBooks: Book[];
}

interface BookReadCount {
	book: Book;
	readCount: number;
	commonUsers: User[];
}

const ReadsPage = () => {
	const [activeTab, setActiveTab] = useState<TabType>('users');
	const { user } = useUser();
	const userId = user?.id;

	const { data, isLoading, error } = useQuery({
		enabled: !!userId,
		queryKey: ['commonReads', userId],
		queryFn: () => getCommonReads(userId!),
	});

	if (!user) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
					<h2 className="text-xl font-bold mb-4 text-gray-800">共読を見るにはログインが必要です</h2>
					<p className="text-gray-600 mb-6">
						共読機能を利用するには、ログイン{ENABLE_JOIN_GROUP ? 'またはグループへの参加' : ''}
						が必要です。
					</p>
					<div className="flex justify-center space-x-4">
						<Link
							to="/login"
							className="px-6 py-2 rounded bg-white text-green-700 border-2 border-green-700 hover:bg-green-50 transition-colors duration-200 cursor-pointer"
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
			<div className="flex justify-center items-center min-h-[70vh]">
				<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
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

	const { reads, books, users } = data;

	const userReadCounts: UserReadCount[] = Object.values(users)
		.map((user) => {
			const userReads = reads.filter((read) => read.user_id === user.id);
			const commonBooks = userReads.map((read) => books[read.book_id]);
			return {
				user,
				readCount: userReads.length,
				commonBooks,
			};
		})
		.sort((a, b) => {
			// First sort by read count in descending order
			const countDiff = b.readCount - a.readCount;
			if (countDiff !== 0) return countDiff;
			// If read counts are equal, sort by user ID in ascending order for stability
			return a.user.id - b.user.id;
		});

	const bookReadCounts: BookReadCount[] = Object.values(books)
		.map((book) => {
			const bookReads = reads.filter((read) => read.book_id === book.id);
			const commonUsers = bookReads.map((read) => users[read.user_id]);
			return {
				book,
				readCount: bookReads.length,
				commonUsers,
			};
		})
		.sort((a, b) => {
			// First sort by read count in descending order
			const countDiff = b.readCount - a.readCount;
			if (countDiff !== 0) return countDiff;
			// If read counts are equal, sort by book ID in ascending order for stability
			return a.book.id - b.book.id;
		});

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<div className="flex space-x-2 mb-4">
				<TabButton isActive={activeTab === 'users'} onClick={() => setActiveTab('users')}>
					共読仲間
				</TabButton>
				<TabButton isActive={activeTab === 'books'} onClick={() => setActiveTab('books')}>
					共読本
				</TabButton>
			</div>

			{activeTab === 'users' ? (
				<div className="space-y-4">
					{userReadCounts.map((userReadCount) => (
						<UserReadCard key={userReadCount.user.id} {...userReadCount} />
					))}
				</div>
			) : (
				<div className="space-y-4">
					{bookReadCounts.map((bookReadCount) => (
						<BookReadCard key={bookReadCount.book.id} {...bookReadCount} />
					))}
				</div>
			)}
		</div>
	);
};

export default ReadsPage;
