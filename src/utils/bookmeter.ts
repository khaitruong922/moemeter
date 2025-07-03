const BOOKMETER_BASE_URL = 'https://bookmeter.com';

export const getUserBookmeterUrl = (userId: number): string => {
	return `${BOOKMETER_BASE_URL}/users/${userId}`;
};

export const getBookBookmeterUrl = (bookId: number): string => {
	return `${BOOKMETER_BASE_URL}/books/${bookId}`;
};
