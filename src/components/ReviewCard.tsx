import type { Review, User } from '../types/models';
import { UserAvatar } from './UserAvatar';

interface ReviewCardProps {
	review: Review;
	user: User;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, user }) => {
	return (
		<div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
			<div className="flex-none">
				<UserAvatar userId={user.id} avatarUrl={user.avatar_url} name={user.name} size="sm" />
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 mb-1">
					<span className="font-medium text-sm text-gray-900">{user.name}</span>
					{review.is_spoiler && (
						<span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">ネタバレ</span>
					)}
					{review.nice_count && review.nice_count > 0 && (
						<span className="text-xs text-gray-500">♥ {review.nice_count}</span>
					)}
				</div>
				{review.content && (
					<div className="text-sm text-gray-700 whitespace-pre-wrap">{review.content}</div>
				)}
				{review.created_at && (
					<div className="text-xs text-gray-500 mt-1">
						{new Date(review.created_at).toLocaleDateString('ja-JP')}
					</div>
				)}
			</div>
		</div>
	);
};
