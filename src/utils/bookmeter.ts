export const getUserBookmeterUrl = (userId: number) => {
	return `https://bookmeter.com/users/${userId}`;
};

export const getBookBookmeterUrl = (bookId: number) => {
	return `https://bookmeter.com/books/${bookId}`;
};
