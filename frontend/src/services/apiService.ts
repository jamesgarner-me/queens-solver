import { BoardData } from '../types/gameTypes';
import { config } from '../config';

/**
 * Fetches the latest board data from the API
 */
export const fetchLatestBoard = async (): Promise<BoardData> => {
    try {
        const response = await fetch(`${config.apiBaseUrl}/boards/latest`);

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch board data:', error);
        throw error;
    }
};
