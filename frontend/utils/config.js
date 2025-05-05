/**
 * Central configuration file for the application
 * All environment variables and configuration settings should be defined here
 */

// API configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Feature flags
export const ENABLE_ANALYTICS = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';
export const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

// Application settings
export const APP_NAME = 'Barta App';
export const DEFAULT_THEME = 'light';

// API request settings
export const API_TIMEOUT = 10000; // 10 seconds 