import { getBookBookmeterUrl } from '../utils/bookmeter';

interface UserReadBookCoverProps {
	bookId: number;
	title: string;
	thumbnailUrl: string;
}

export const UserReadBookCover: React.FC<UserReadBookCoverProps> = ({
	bookId,
	title,
	thumbnailUrl,
}) => {
	return (
		<a
			href={getBookBookmeterUrl(bookId)}
			target="_blank"
			rel="noopener noreferrer"
			className="block w-[calc(25%-0.5rem)] sm:w-[calc(20%-0.5rem)] md:w-[calc(16.666%-0.5rem)] lg:w-[calc(14.285%-0.5rem)] xl:w-[calc(12.5%-0.5rem)]"
		>
			<div className="relative pb-[142.857%]">
				<img
					src={thumbnailUrl}
					alt={title}
					title={title}
					className="absolute inset-0 w-full h-full object-cover rounded shadow-sm"
					loading="lazy"
				/>
			</div>
		</a>
	);
};
