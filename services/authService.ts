import axiosInstance from "@/lib/axios";
import { LoginRequest, LoginResponse } from "@/types/Auth";
import { AuthenticatedUser } from "@/types/User";

export const authService = {
  login: async (req: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>("/auth/login", req);
    const { accessToken, userId } = response.data;

    const payload = JSON.parse(atob(accessToken.split(".")[1]));

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("userId", JSON.stringify(userId));
    localStorage.setItem("token_exp", (payload.exp * 1000).toString());

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    return response.data;
  },

  fetchCurrentUser: async (): Promise<AuthenticatedUser | null> => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      const response = await axiosInstance.get<AuthenticatedUser>("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  },

  logout: (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("token_exp");
    delete axiosInstance.defaults.headers.common["Authorization"];
  },
};
