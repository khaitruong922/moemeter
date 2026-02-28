import type { Book, User } from '../types/models';
import { getAuthorBookmeterUrl, getBookBookmeterUrl } from '../utils/bookmeter';
import { BookCover } from './BookCover';
import { UserAvatarGroup } from './UserAvatarGroup';
import { ReviewList } from './ReviewList';
import React, { useState } from 'react';

interface BookCardBaseProps {
	book: Book;
	index: number;
	userCount: number;
	avatarUsers: User[];
	isRead: boolean;
	showCheck?: boolean;
	reviewIsRead?: boolean;
	children?: React.ReactNode;
	userCountLabel?: string;
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
	userCountLabel,
}) => {
	const [showReviews, setShowReviews] = useState(false);
	const hasReviews = book.reviews && book.reviews.length > 0;
	const _userCountLabel = userCountLabel ? userCountLabel : `${userCount}人`;

	return (
		<div className="bg-white overflow-hidden">
			<div className="flex items-start gap-2 sm:gap-4 p-2 sm:p-4">
				<div className="flex-none w-12 sm:w-16 text-center flex flex-col justify-between">
					<div>
						<div className={`text-lg sm:text-2xl font-bold bookmeter-green-text`}>#{index}</div>
						<div className="text-xs sm:text-sm text-gray-500">{_userCountLabel}</div>
						{book.date && (
							<div className="text-[0.625rem] text-gray-400 mt-1 break-words leading-tight">
								{new Date(book.date).toLocaleDateString('ja-JP')}
							</div>
						)}
					</div>
					{hasReviews && (
						<div className="flex justify-center mt-2 mb-1 grow items-end">
							<button
								onClick={() => setShowReviews((v) => !v)}
								className={`flex flex-row items-center cursor-pointer`}
								aria-label={`Show ${book.reviews.length} reviews`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="#77b944"
									className="w-5 h-5"
								>
									<path d="M12 2C6.48 2 2 6.02 2 11c0 2.18.88 4.16 2.34 5.72L4 22l4.52-2.36C9.61 20.2 10.77 20.5 12 20.5c5.52 0 10-4.02 10-9.5S17.52 2 12 2z" />
									<rect x="8" y="9" width="8" height="1.5" fill="white" />
									<rect x="8" y="12" width="5" height="1.5" fill="white" />
								</svg>

								<div className="ml-[2px] text-sm bookmeter-green-text">{book.reviews.length}</div>
							</button>
						</div>
					)}
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
							className="text-base sm:text-lg bookmeter-green-text font-bold text-left"
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
			{hasReviews && showReviews && (
				<div className="w-full px-2 sm:px-4 pb-2 sm:pb-4">
					<ReviewList reviews={book.reviews} isRead={reviewIsRead} />
				</div>
			)}
			{children}
		</div>
	);
};
