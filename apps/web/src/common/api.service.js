import axios from 'axios';
import { getToken } from './jwt.service';

// Create an axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000/'
});

// Add a request interceptor to attach the token to each request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
