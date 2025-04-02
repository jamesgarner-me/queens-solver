import { BoardData } from '../types/gameTypes';
import { config } from '../config';

/**
 * Base API request function with error handling and logging
 */
const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const url = `${config.apiBaseUrl}${endpoint}`;

    // Default request options
    const defaultOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        credentials: 'omit', // Important for CORS
    };

    // Merge default options with provided options
    const requestOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        console.log(`API Request: ${url}`);
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            const errorMessage = `API request failed with status ${response.status}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data as T;
    } catch (error) {
        console.error(`API Request Error for ${endpoint}:`, error);
        throw error;
    }
};

/**
 * Fetches the latest board data from the API
 */
export const fetchLatestBoard = async (): Promise<BoardData> => {
    try {
        console.log(`Fetching board data from environment: ${config.environment}`);
        const data = await apiRequest<BoardData>('/boards/latest');
        console.log('Successfully fetched board data');
        return data;
    } catch (error) {
        console.error('Failed to fetch board data:', error);
        throw error;
    }
};
