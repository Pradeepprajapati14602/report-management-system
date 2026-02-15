/**
 * Frontend Configuration
 * Load environment variables from Vite
 */

export const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),

  // Application Info
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Report Management System',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',

  // File Upload Configuration
  MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '10485760', 10), // 10MB
  ALLOWED_FILE_TYPES: import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(',') || [
    '.pdf',
    '.jpg',
    '.jpeg',
    '.png',
    '.doc',
    '.docx'
  ],
};

export default config;
