/// <reference types="vite/client" />
import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        // Ensure url doesn't start with a slash so it properly appends to baseURL
        if (config.url && config.url.startsWith('/')) {
            config.url = config.url.substring(1);
        }
        
        // Ensure baseURL ends with a slash
        if (config.baseURL && !config.baseURL.endsWith('/')) {
            config.baseURL += '/';
        }

        const token = localStorage.getItem('vidhik_auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('vidhik_auth_token');
            localStorage.removeItem('vidhik_user_data');
            window.location.href = '/user/login';
        }
        return Promise.reject(error);
    }
);

export default api;
