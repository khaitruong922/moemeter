type Props = {
	avatarUrl?: string | null;
	name?: string | null;
	size?: number;
};

const UserAvatar = ({ avatarUrl, name, size = 48 }: Props) => {
	const sizeClass = `h-[${size}px] w-[${size}px]`;
	if (avatarUrl) {
		return (
			<img
				className={`rounded-full border-2 border-gray-200 h-[48px] w-[48px]`}
				src={avatarUrl}
				alt=""
			/>
		);
	}

	return (
		<div
			className={`rounded-full border-2 border-gray-200 bg-white flex items-center justify-center ${sizeClass}`}
		>
			<span className="text-gray-400 text-sm font-medium">{name?.[0]?.toUpperCase() ?? '?'}</span>
		</div>
	);
};

export default UserAvatar;
