import type { User } from '../types/models';
import { UserAvatar } from './UserAvatar';

interface Props {
	users: User[];
	size?: 'sm' | 'md' | 'lg';
}

export const UserAvatarGroup: React.FC<Props> = ({ users, size = 'md' }) => {
	return (
		<div className="flex flex-wrap gap-1">
			{users.map((user) => (
				<UserAvatar
					key={user.id}
					userId={user.id}
					name={user.name}
					avatarUrl={user.avatar_url}
					size={size}
					toProfile
				/>
			))}
		</div>
	);
};
