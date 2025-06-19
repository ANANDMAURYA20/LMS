import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000';

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 300000 // Increased to 5 minutes for large file uploads
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        // If the error is 401, clear token and redirect to login
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            toast.error('Session expired. Please login again.');
            window.location.href = '/login';
            return Promise.reject(error);
        }

        // Handle other errors
        const message = error.response?.data?.message || 'Something went wrong';
        toast.error(message);
        return Promise.reject(error);
    }
);