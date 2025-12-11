import { getUserBookmeterUrl } from '../utils/bookmeter';

interface UserAvatarProps {
	userId: number;
	name: string;
	avatarUrl: string;
	size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
	sm: 'w-8 h-8',
	md: 'w-14 h-14',
	lg: 'w-20 h-20',
	xl: 'w-32 h-32',
};

export const UserAvatar: React.FC<UserAvatarProps> = ({ userId, name, avatarUrl, size = 'md' }) => {
	return (
		<a href={getUserBookmeterUrl(userId)} target="_blank" rel="noopener noreferrer">
			<img
				src={avatarUrl}
				alt={name}
				title={name}
				className={`${sizeClasses[size]} rounded-full ring-1 ring-gray-200`}
				loading="lazy"
			/>
		</a>
	);
};
