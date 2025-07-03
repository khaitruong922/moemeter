import { getUserBookmeterUrl } from '../utils/bookmeter';

interface UserAvatarProps {
	userId: number;
	name: string;
	avatarUrl: string;
	size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
	sm: 'w-8 h-8',
	md: 'w-12 h-12',
	lg: 'w-16 h-16',
};

export const UserAvatar: React.FC<UserAvatarProps> = ({ userId, name, avatarUrl, size = 'md' }) => {
	return (
		<a href={getUserBookmeterUrl(userId)} target="_blank" rel="noopener noreferrer">
			<img
				src={avatarUrl}
				alt={name}
				title={name}
				className={`${sizeClasses[size]} rounded-full`}
			/>
		</a>
	);
};
