import { API_URL } from '.';

export const getLeaderboard = async () => {
	try {
		const response = await fetch(`${API_URL}/users/leaderboard`);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error('Error fetching leaderboard:', error);
		throw error;
	}
};
