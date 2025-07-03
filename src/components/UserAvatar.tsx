type Props = {
	avatarUrl?: string | null;
	name?: string | null;
};

const UserAvatar = ({ avatarUrl, name }: Props) => {
	if (avatarUrl) {
		return (
			<img className="h-12 w-12 rounded-full border-2 border-gray-200" src={avatarUrl} alt="" />
		);
	}

	return (
		<div className="h-12 w-12 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center">
			<span className="text-gray-400 text-sm font-medium">{name?.[0]?.toUpperCase() ?? '?'}</span>
		</div>
	);
};

export default UserAvatar;
