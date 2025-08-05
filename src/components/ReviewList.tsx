import type { Review } from '../types/models';
import { ReviewCard } from './ReviewCard';

interface ReviewListProps {
	reviews: Review[];
	isRead?: boolean;
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, isRead = false }) => {
	return (
		<div className="space-y-2">
			{reviews.map((review) => (
				<ReviewCard key={review.id} review={review} isRead={isRead} />
			))}
		</div>
	);
};
