import type { ReactNode } from 'react';

interface SectionHeaderProps {
	title: string;
	description?: string;
	metadata?: string;
	count?: string;
	emptyMessage?: string;
	isLoading?: boolean;
	loadingMessage?: string;
	footer?: ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
	title,
	description,
	metadata,
	count,
	emptyMessage,
	isLoading,
	loadingMessage,
	footer,
}) => {
	const showEmpty = !isLoading && emptyMessage;

	return (
		<div className="mb-4 text-center">
			<h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
			{metadata && <p className="mt-1 text-center text-xs text-gray-400">{metadata}</p>}
			{showEmpty && <p className="text-center text-gray-500 mt-4">{emptyMessage}</p>}
			{!showEmpty && (
				<>
					{description && <p className="mt-2 text-base text-gray-600">{description}</p>}
					{isLoading && loadingMessage ? (
						<p className="text-sm text-gray-500 mt-1">{loadingMessage}</p>
					) : (
						count && <p className="text-sm text-gray-500 mt-1">{count}</p>
					)}
				</>
			)}
			{footer}
		</div>
	);
};
