export const BOOKMETER_BASE_URL = 'https://bookmeter.com';

export const getUserBookmeterUrl = (userId: number): string => {
	return `${BOOKMETER_BASE_URL}/users/${userId}`;
};

export const getBookBookmeterUrl = (bookId: number): string => {
	return `${BOOKMETER_BASE_URL}/books/${bookId}`;
};

export const getAuthorBookmeterUrl = (path: string): string => {
	return `${BOOKMETER_BASE_URL}${path}`;
};

export const extractUserIdFromBookmeterUrl = (input: string): number | null => {
	// Try to parse as direct user ID first
	const directId = parseInt(input);
	if (!isNaN(directId)) {
		return directId;
	}

	// Try to extract from Bookmeter URL
	try {
		const url = new URL(input);
		if (url.hostname === 'bookmeter.com') {
			const match = url.pathname.match(/\/users\/(\d+)/);
			if (match) {
				return parseInt(match[1]);
			}
		}
	} catch {
		// Invalid URL, return null
	}
	return null;
};
