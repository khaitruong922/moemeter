interface FilterButtonProps {
	value: string;
	currentValue: string;
	label: string;
	onClick: (value: string) => void;
	borderClass?: string;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
	value,
	currentValue,
	label,
	onClick,
	borderClass = '',
}) => {
	return (
		<button
			type="button"
			onClick={() => onClick(value)}
			className={`flex-1 text-xs sm:text-sm py-2 px-2 sm:px-4 font-medium transition-colors cursor-pointer ${borderClass} ${
				currentValue === value
					? 'bookmeter-green text-white'
					: 'bg-white bookmeter-green-text hover:bg-[#f0fae8]'
			}`}
		>
			{label}
		</button>
	);
};

interface FilterGroupProps {
	children: React.ReactNode;
}

export const FilterGroup: React.FC<FilterGroupProps> = ({ children }) => {
	return (
		<div className="flex w-full rounded-lg overflow-hidden border border-[#77b944]/20">
			{children}
		</div>
	);
};
