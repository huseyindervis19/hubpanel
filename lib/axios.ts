import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const baseConfig: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
  timeout: 10000,
};

const apiClient: AxiosInstance = axios.create(baseConfig);

//
//  Request Interceptor
//
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("Request error:", error.message);
    return Promise.reject(error);
  }
);

//
//  Response Interceptor
//
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const url = error.config?.url || "";

      if (status === 401 && !url.includes("/auth/login")) {
        console.warn("🔒 Unauthorized — redirecting to signin...");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        if (typeof window !== "undefined") {
          window.location.href = "/signin";
        }
      }

      console.error(" API Error:", {
        url,
        status,
        data: error.response.data,
      });
    }
    else if (error.request) {
      console.error("No response received from server:", error.request);
    }
    else {
      console.error("Axios setup error:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
