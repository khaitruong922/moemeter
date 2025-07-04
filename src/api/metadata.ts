import { API_URL } from '.';

export const getMetadata = async () => {
	const response = await fetch(`${API_URL}/metadata`);
	if (!response.ok) throw new Error('Failed to fetch metadata');
	return response.json();
};
