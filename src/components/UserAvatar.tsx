import { Link } from 'react-router-dom';
import { getUserBookmeterUrl } from '../utils/bookmeter';

interface UserAvatarProps {
	userId: number;
	name: string;
	avatarUrl: string;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	toProfile?: boolean;
}

const sizeClasses = {
	sm: 'w-8 h-8',
	md: 'w-14 h-14',
	lg: 'w-20 h-20',
	xl: 'w-32 h-32',
};

type AvatarImageProps = {
	avatarUrl: string;
	name: string;
	sizeClass: string;
};
const AvatarCircle: React.FC<AvatarImageProps> = ({ avatarUrl, name, sizeClass }) => {
	return (
		<img
			src={avatarUrl}
			alt={name}
			title={name}
			className={`${sizeClass} rounded-full ring-1 ring-gray-200`}
			loading="lazy"
		/>
	);
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
	userId,
	name,
	avatarUrl,
	size = 'md',
	toProfile = false,
}) => {
	if (toProfile) {
		return (
			<Link to={`/profile/${userId}`}>
				<AvatarCircle avatarUrl={avatarUrl} name={name} sizeClass={sizeClasses[size]} />
			</Link>
		);
	}

	return (
		<a href={getUserBookmeterUrl(userId)} target="_blank" rel="noopener noreferrer">
			<AvatarCircle avatarUrl={avatarUrl} name={name} sizeClass={sizeClasses[size]} />
		</a>
	);
};
