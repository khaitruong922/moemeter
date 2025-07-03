interface TabButtonProps {
	isActive: boolean;
	onClick: () => void;
	children: React.ReactNode;
}

export const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, children }) => {
	return (
		<button
			className={`px-4 py-2 rounded-lg ${
				isActive
					? 'bookmeter-green text-white'
					: 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
			}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
};
