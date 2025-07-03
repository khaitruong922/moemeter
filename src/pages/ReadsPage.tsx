import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCommonReads } from '../api/users';
import type { Book, User } from '../types/models';
import { TabButton } from '../components/TabButton';
import { UserReadCard } from '../components/UserReadCard';
import { BookReadCard } from '../components/BookReadCard';

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
	const userId = 1485435; // TODO: Make this dynamic based on the logged-in user

	const { data, isLoading, error } = useQuery({
		queryKey: ['commonReads', userId],
		queryFn: () => getCommonReads(userId),
	});

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
					共通の本を読んでいるユーザー
				</TabButton>
				<TabButton isActive={activeTab === 'books'} onClick={() => setActiveTab('books')}>
					共通の本
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
