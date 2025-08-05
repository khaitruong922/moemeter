import type { Book, User } from '../types/models';
import { getAuthorBookmeterUrl, getBookBookmeterUrl } from '../utils/bookmeter';
import { BookCover } from './BookCover';
import { UserAvatarGroup } from './UserAvatarGroup';
import { ReviewList } from './ReviewList';
import React from 'react';

interface BookCardBaseProps {
	book: Book;
	index: number;
	userCount: number;
	avatarUsers: User[];
	isRead: boolean;
	showCheck?: boolean;
	reviewIsRead?: boolean;
	children?: React.ReactNode;
}

export const BookCardBase: React.FC<BookCardBaseProps> = ({
	book,
	index,
	userCount,
	avatarUsers,
	isRead,
	showCheck = false,
	reviewIsRead = false,
	children,
}) => {
	const hasReviews = book.reviews && book.reviews.length > 0;
	return (
		<div className="bg-white overflow-hidden">
			<div className="flex items-start gap-2 sm:gap-4 p-2 sm:p-4">
				<div className="flex-none w-12 sm:w-16 text-center">
					<div className={`text-lg sm:text-2xl font-bold bookmeter-green-text`}>#{index}</div>
					<div className="text-xs sm:text-sm text-gray-500">{userCount}人</div>
				</div>
				<div className="flex-none">
					<BookCover bookId={book.id} title={book.title} thumbnailUrl={book.thumbnail_url} />
				</div>
				<div className="flex-1 min-w-0 flex flex-col relative">
					{showCheck && isRead && (
						<div className="absolute top-0 right-0 z-10">
							<span className="bg-[#77b944] text-white text-sm px-2 py-1 rounded-full flex items-center justify-center w-6 h-6 select-none">
								✔
							</span>
						</div>
					)}
					<div className={`flex items-center gap-2 mb-1 ${isRead ? 'pr-8' : ''}`}>
						<a
							href={getBookBookmeterUrl(book.id)}
							target="_blank"
							rel="noopener noreferrer"
							className="text-base sm:text-lg bookmeter-green-text font-bold line-clamp-2 text-left"
						>
							{book.title}
						</a>
					</div>
					<a
						href={getAuthorBookmeterUrl(book.author_url)}
						target="_blank"
						rel="noopener noreferrer"
						className="text-xs sm:text-sm bookmeter-green-text text-left"
					>
						{book.author}
					</a>
					<div className="mt-1 sm:mt-2">
						<UserAvatarGroup users={avatarUsers} size="sm" />
					</div>
				</div>
			</div>
			{hasReviews && (
				<div className="w-full px-2 sm:px-4 pb-2 sm:pb-4">
					<ReviewList reviews={book.reviews} isRead={reviewIsRead} />
				</div>
			)}
			{children}
		</div>
	);
};
