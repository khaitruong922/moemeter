import { API_URL } from '.';

export interface Group {
	id: number;
	name: string;
}

export const getGroups = async (): Promise<Group[]> => {
	const response = await fetch(`${API_URL}/groups`);
	if (!response.ok) {
		throw new Error('Failed to fetch groups');
	}
	return response.json();
};
