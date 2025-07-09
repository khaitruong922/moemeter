import { API_URL } from '.';

type Metadata = {
	last_updated: string;
	failed_users: number;
	total_users: number;
};
export const getMetadata = async (): Promise<Metadata> => {
	const response = await fetch(`${API_URL}/metadata`);
	if (!response.ok) throw new Error('Failed to fetch metadata');
	return response.json();
};
