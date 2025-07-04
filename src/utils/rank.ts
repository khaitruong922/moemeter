export const getRankTextColorStyle = (rank: number, defaultStyle: string = 'text-gray-900') => {
	if (rank === 1) return 'text-[#ffa700]';
	if (rank === 2) return 'text-[#777]';
	if (rank === 3) return 'text-[#a7641c]';
	return defaultStyle;
};
