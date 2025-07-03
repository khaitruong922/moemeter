import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCommonReads } from '../api/users';
import type { Book, User } from '../types/models';
import { getBookBookmeterUrl, getUserBookmeterUrl } from '../utils/bookmeter';

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

	// Calculate user read counts with common books
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
		.sort((a, b) => b.readCount - a.readCount);

	// Calculate book read counts with common users
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
		.sort((a, b) => b.readCount - a.readCount);

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<div className="flex space-x-2 mb-4 sticky top-0 py-2 z-10">
				<button
					className={`px-4 py-2 rounded-lg ${
						activeTab === 'users'
							? 'bookmeter-green text-white'
							: 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
					}`}
					onClick={() => setActiveTab('users')}
				>
					共通の本を読んでいるユーザー
				</button>
				<button
					className={`px-4 py-2 rounded-lg ${
						activeTab === 'books'
							? 'bookmeter-green text-white'
							: 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
					}`}
					onClick={() => setActiveTab('books')}
				>
					みんなが読んでいる本
				</button>
			</div>

			{activeTab === 'users' ? (
				<div className="space-y-4">
					{userReadCounts.map(({ user, readCount, commonBooks }) => (
						<div key={user.id} className="p-4 bg-white rounded-lg shadow">
							<div className="flex items-center space-x-4 mb-4">
								<a href={getUserBookmeterUrl(user.id)} target="_blank" rel="noopener noreferrer">
									<img src={user.avatar_url} alt={user.name} className="w-12 h-12 rounded-full" />
								</a>
								<div className="flex-grow flex flex-col items-start">
									<a href={getUserBookmeterUrl(user.id)} target="_blank" rel="noopener noreferrer">
										<h3 className="text-lg font-semibold text-[#219315]">{user.name}</h3>
									</a>
									<p className="text-gray-600">
										共通の読書数:{' '}
										<span className="font-bold bookmeter-green-text">{readCount}冊</span>
									</p>
								</div>
							</div>
							<div className="flex flex-wrap gap-2 mt-4">
								{commonBooks.map((book) => (
									<a
										key={book.id}
										href={getBookBookmeterUrl(book.id)}
										target="_blank"
										rel="noopener noreferrer"
										className="block w-28 h-40 relative group"
									>
										<img
											src={book.thumbnail_url}
											alt={book.title}
											className="w-full h-full object-cover rounded shadow-sm transition-transform transform group-hover:scale-105"
											title={book.title}
										/>
									</a>
								))}
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="space-y-6">
					{bookReadCounts.map(({ book, readCount, commonUsers }) => (
						<div key={book.id} className="p-4 bg-white rounded-lg shadow">
							<div className="flex items-start space-x-4">
								<a
									href={getBookBookmeterUrl(book.id)}
									target="_blank"
									rel="noopener noreferrer"
									className="block flex-shrink-0"
								>
									<img
										src={book.thumbnail_url}
										alt={book.title}
										className="w-20 h-28 object-cover rounded shadow-sm transition-transform transform hover:scale-105"
									/>
								</a>
								<div className="flex-grow">
									<h3 className="text-lg font-semibold text-[#219315] mb-1">{book.title}</h3>
									<p className="text-[#219315] text-sm mb-2">{book.author}</p>
									<p className="text-gray-600 mb-3">
										共通の読者数: <span className="font-bold">{readCount}</span> 人
									</p>
									<div className="flex flex-wrap gap-2">
										{commonUsers.map((user) => (
											<img
												key={user.id}
												src={user.avatar_url}
												alt={user.name}
												title={user.name}
												className="w-8 h-8 rounded-full shadow-sm transition-transform transform hover:scale-110"
											/>
										))}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ReadsPage;
