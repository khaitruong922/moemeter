import { useState } from 'react';
import type { Review } from '../types/models';
import { ReviewCard } from './ReviewCard';

interface ReviewListProps {
	reviews: Review[];
	isRead?: boolean;
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, isRead = false }) => {
	const [isExpanded, setIsExpanded] = useState(false);

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
						{reviews.map((review) => (
							<ReviewCard key={review.id} review={review} isRead={isRead} />
						))}
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
