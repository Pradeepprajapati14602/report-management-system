import axios from 'axios';
import { config } from '../config';

const API_BASE_URL = import.meta.env.DEV ? '/api' : config.API_BASE_URL;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: config.API_TIMEOUT,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (requestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            requestConfig.headers.Authorization = `Bearer ${token}`;
        }
        return requestConfig;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Only redirect if NOT on login page
            const currentPath = window.location.pathname;
            if (currentPath !== '/login') {
                // Token expired or invalid - clear auth and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
