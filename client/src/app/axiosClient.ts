import axios from 'axios';

// 1. Create the Instance (The "Base" Configuration)
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Now you only type "/files", not the whole URL
  timeout: 10000, // Fail if request takes longer than 10 seconds
});

// 2. The Request Interceptor (The "Auto-Token" Adder)
api.interceptors.request.use(
  (config) => {
    // Check if we have a token in local storage
    const token = localStorage.getItem('token');

    // If we do, attach it to the header automatically
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 3. The Response Interceptor (The "Global Error" Handler)
api.interceptors.response.use(
  (response) => response, // If success, just pass it through
  (error) => {
    // If the token expired (401), we can force logout here automatically
    if (error.response?.status === 401) {
      console.error('Session expired. Logging out...');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
