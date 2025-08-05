import { useState } from 'react';
import type { Review } from '../types/models';

interface ReviewListProps {
	reviews: Review[];
	isRead?: boolean;
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, isRead = false }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [revealedSpoilers, setRevealedSpoilers] = useState<Set<number>>(new Set());

	const toggleSpoiler = (reviewId: number) => {
		setRevealedSpoilers((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(reviewId)) {
				newSet.delete(reviewId);
			} else {
				newSet.add(reviewId);
			}
			return newSet;
		});
	};

	if (reviews.length === 0) {
		return null;
	}

	return (
		<div className="mt-3">
			{!isExpanded ? (
				<div className="flex justify-end">
					<button
						onClick={() => setIsExpanded(true)}
						className="text-sm bookmeter-green-text hover:underline focus:outline-none cursor-pointer"
					>
						感想・レビュー ({reviews.length})
					</button>
				</div>
			) : (
				<>
					<div className="space-y-2">
						{reviews.map((review) => {
							const isSpoiler = review.is_spoiler && !isRead;
							const isRevealed = revealedSpoilers.has(review.id);

							return (
								<div key={review.id} className="bg-gray-50 rounded-lg p-3 text-left">
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
											<span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
												ネタバレ
											</span>
										)}
									</div>
									{review.content && (
										<div className="text-sm text-gray-700 whitespace-pre-wrap">
											{isSpoiler && !isRevealed ? (
												<button
													onClick={() => toggleSpoiler(review.id)}
													className="text-sm bookmeter-green-text hover:underline cursor-pointer"
												>
													ネタバレを表示
												</button>
											) : (
												<div>
													{review.content}
													{isSpoiler && isRevealed && (
														<button
															onClick={() => toggleSpoiler(review.id)}
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
						})}
					</div>

					<div className="flex justify-end mt-2">
						<button
							onClick={() => setIsExpanded(false)}
							className="text-sm bookmeter-green-text hover:underline focus:outline-none cursor-pointer"
						>
							閉じる
						</button>
					</div>
				</>
			)}
		</div>
	);
};
