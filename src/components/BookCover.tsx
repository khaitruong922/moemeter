import { getBookBookmeterUrl } from '../utils/bookmeter';

interface BookCoverProps {
	bookId: number;
	title: string;
	thumbnailUrl: string;
	size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
	sm: 'w-20 h-28',
	md: 'w-28 h-40',
	lg: 'w-36 h-48',
};

export const BookCover: React.FC<BookCoverProps> = ({
	bookId,
	title,
	thumbnailUrl,
	size = 'md',
}) => {
	return (
		<a
			href={getBookBookmeterUrl(bookId)}
			target="_blank"
			rel="noopener noreferrer"
			className="block"
		>
			<img
				src={thumbnailUrl}
				alt={title}
				title={title}
				className={`${sizeClasses[size]} object-cover rounded shadow-sm`}
			/>
		</a>
	);
};
