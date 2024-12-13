import axios from 'axios';

// Create axios instance
export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || '/api/v1',
    withCredentials: true
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Global error handling
        const message = error.response?.data?.message || 'An error occurred';
        
        // You can add more specific error handling here
        switch (error.response?.status) {
            case 401:
                // Handle unauthorized access
                break;
            case 403:
                // Handle forbidden access
                break;
            case 500:
                // Handle server errors
                break;
            default:
                break;
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;