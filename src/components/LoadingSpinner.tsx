interface LoadingSpinnerProps {
	message?: string;
	size?: 'sm' | 'md';
	centered?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	message,
	size = 'md',
	centered = true,
}) => {
	const sizeClasses = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8';
	const containerClasses = centered
		? 'flex flex-col justify-center items-center h-full'
		: 'flex justify-center';

	return (
		<div className={containerClasses}>
			<div
				className={`animate-spin rounded-full ${sizeClasses} border-t-2 border-b-2 border-gray-900 ${message ? 'mb-4' : ''}`}
			></div>
			{message && <div className="text-gray-400 text-sm">{message}</div>}
		</div>
	);
};
