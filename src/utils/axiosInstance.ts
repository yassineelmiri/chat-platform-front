import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default_key';
const AUTH_TOKEN_COOKIE = import.meta.env.VITE_AUTH_TOKEN_COOKIE || 'authToken';
const API_URL = import.meta.env.VITE_API_URL || '';

const axiosInstance = axios.create({
    baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const encryptedToken = Cookies.get(AUTH_TOKEN_COOKIE);
        if (encryptedToken) {
            try {
                const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY);
                const token = bytes.toString(CryptoJS.enc.Utf8);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Failed to decrypt token:', error);
                // here opptionally logout the user if token decryption fails

            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            //  here we will handle unauthorized - token might be expired or invalid

        }
        return Promise.reject(error);
    }
);

export default axiosInstance;