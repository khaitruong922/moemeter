import type { Review } from '../types/models';
import { useState } from 'react';

interface ReviewCardProps {
	review: Review;
	isRead?: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, isRead = false }) => {
	const [isRevealed, setIsRevealed] = useState(false);
	const isSpoiler = review.is_spoiler && !isRead;

	return (
		<div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-left">
			<div className="flex items-center gap-2 mb-2">
				{review.user_avatar_url && (
					<img
						src={review.user_avatar_url}
						alt={review.user_name || 'User'}
						title={review.user_name || 'User'}
						className="w-8 h-8 rounded-full ring-1 ring-gray-200"
					/>
				)}
				{review.user_name && (
					<a
						href={`https://bookmeter.com/users/${review.user_id}`}
						target="_blank"
						rel="noopener noreferrer"
						className="font-bold text-base bookmeter-green-text hover:underline"
					>
						{review.user_name}
					</a>
				)}
				{review.is_spoiler && (
					<span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">ネタバレ</span>
				)}
			</div>
			{review.content && (
				<div className="text-sm text-gray-700 whitespace-pre-wrap">
					{isSpoiler && !isRevealed ? (
						<button
							onClick={() => setIsRevealed(true)}
							className="text-sm bookmeter-green-text hover:underline cursor-pointer"
						>
							ネタバレを表示
						</button>
					) : (
						<div>
							{review.content}
							{isSpoiler && isRevealed && (
								<button
									onClick={() => setIsRevealed(false)}
									className="text-sm bookmeter-green-text hover:underline cursor-pointer"
								>
									隠す
								</button>
							)}
						</div>
					)}
				</div>
			)}
			<div className="flex items-center gap-2 mt-2">
				{review.nice_count && review.nice_count > 0 && (
					<span className="text-xs bookmeter-green-text">★{review.nice_count}</span>
				)}
				{review.created_at && (
					<span className="text-xs text-gray-500">
						{new Date(review.created_at).toLocaleDateString('ja-JP')}
					</span>
				)}
			</div>
		</div>
	);
};
