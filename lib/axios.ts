import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

// ==========================
// Smart Logger
// ==========================
const isDev = process.env.NODE_ENV === "development";

const logError = (...args: any[]) => {
  if (isDev) console.error(...args);
};

const logWarn = (...args: any[]) => {
  if (isDev) console.warn(...args);
};

// ==========================
// Axios Base Config
// ==========================
const baseConfig: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
  timeout: 10000,
};

const apiClient: AxiosInstance = axios.create(baseConfig);

// ==========================
// Request Interceptor
// ==========================
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    logError("Request error:", error.message);
    return Promise.reject(error);
  }
);

// ==========================
// Response Interceptor
// ==========================
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const url = error.config?.url ?? "unknown";

      // ====== Handle Unauthorized (401) ======
      if (status === 401 && !url.includes("/auth/login")) {
        logWarn("Unauthorized — redirecting to signin...");

        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userId");
          window.location.href = "/signin";
        }
      }

      // ====== Log error in development only ======
      logError(
        "API Error:",
        "URL:", url,
        "STATUS:", status,
        "DATA:", error.response.data ?? "No response"
      );
    }
    else if (error.request) {
      logError("No response received from server:", error.request);
    }
    else {
      logError("Axios setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
