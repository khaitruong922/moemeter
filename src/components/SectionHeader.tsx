import { useQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { getMetadata } from '../api/metadata';
import { formatDatetime } from '../utils/datetime';

interface SectionHeaderProps {
	title: string;
	description?: string;
	count?: string;
	emptyMessage?: string;
	isLoading?: boolean;
	loadingMessage?: string;
	footer?: ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
	title,
	description,
	count,
	emptyMessage,
	isLoading,
	loadingMessage,
	footer,
}) => {
	const { data: metadata } = useQuery({ queryKey: ['metadata'], queryFn: getMetadata });

	const showEmpty = !isLoading && emptyMessage;

	const metadataText = metadata
		? `最終更新: ${formatDatetime(metadata.last_updated)}${
				typeof metadata.total_users === 'number' && typeof metadata.failed_users === 'number'
					? ` 同期済み: ${metadata.total_users - metadata.failed_users}/${metadata.total_users}人`
					: ''
			}`
		: undefined;

	return (
		<div className="mb-4 text-center">
			<h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
			{metadataText && <p className="mt-1 text-center text-xs text-gray-400">{metadataText}</p>}
			{showEmpty && <p className="text-center text-gray-500 mt-4">{emptyMessage}</p>}
			{!showEmpty && (
				<>
					{description && <p className="mt-2 text-base text-gray-600">{description}</p>}
					{isLoading && loadingMessage ? (
						<p className={`text-sm text-gray-500 ${description ? 'mt-1' : 'mt-2'}`}>
							{loadingMessage}
						</p>
					) : (
						count && (
							<p className={`text-sm text-gray-500 ${description ? 'mt-1' : 'mt-2'}`}>{count}</p>
						)
					)}
				</>
			)}
			{footer}
		</div>
	);
};
