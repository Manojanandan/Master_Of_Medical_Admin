import axios from "axios";

export const instance = axios.create({
    baseURL: 'http://luxcycs.com:5500/',
    withCredentials: true
});

// Add request interceptor to dynamically set authorization header
instance.interceptors.request.use(
    (config) => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6Ik1hbm9qIiwiZW1haWwiOiJtYW5vanJhZ2F2MjNAZ21haWwuY29tIiwicGhvbmUiOiI5ODY1MDczNDEyIiwiaWF0IjoxNzUxNjQyNjg3LCJleHAiOjE3NTQyMzQ2ODd9.zMdkRENDqvnXBGjo_es7p45mLsw7wM195xxPJsS3i5s";
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle authentication errors
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
          alert()
            // Token is invalid or expired
            // sessionStorage.removeItem("jwt");
            // window.location.href = "/loginform";
        }
        return Promise.reject(error);
    }
);

export default instance