interface Config {
    apiBaseUrl: string;
    isDevelopment: boolean;
    isProduction: boolean;
    environment: string;
}

// Get environment variables
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const environment = import.meta.env.VITE_ENV || 'development';
const isDevelopment = environment === 'development';
const isProduction = environment === 'production';

// Log environment information in development
if (isDevelopment) {
    console.log('Environment:', environment);
    console.log('API Base URL:', apiBaseUrl);
}

export const config: Config = {
    apiBaseUrl,
    isDevelopment,
    isProduction,
    environment,
};
