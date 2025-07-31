import axios from "axios";

export const instance = axios.create({
  baseURL: "http://luxcycs.com:5500/",
  withCredentials: true,
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("jwt"); // always use the latest
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/get-auth-token") // prevent infinite loop
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.get("http://luxcycs.com:5500/get-auth-token", {
          withCredentials: true,
        });

        const newToken = res?.data?.accessToken;
        if (newToken) {
          sessionStorage.setItem("jwt", newToken);

          // Retry original request with new token
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return instance(originalRequest);
        } else {
          throw new Error("No accessToken in refresh response");
        }
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        sessionStorage.removeItem("jwt");
        window.location.href = "/loginform";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
