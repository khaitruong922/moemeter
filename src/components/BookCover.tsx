import { getBookBookmeterUrl } from '../utils/bookmeter';

interface BookCoverProps {
	bookId: number;
	title: string;
	thumbnailUrl: string;
}

export const BookCover: React.FC<BookCoverProps> = ({ bookId, title, thumbnailUrl }) => {
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
				className="w-21 h-30 sm:w-28 sm:h-40 object-cover rounded shadow-sm"
			/>
		</a>
	);
};
