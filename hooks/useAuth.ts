import { useMutation, useQuery, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { LoginRequest, LoginResponse, ForgotPasswordRequest, ForgotPasswordResponse, ResetPasswordRequest, ResetPasswordResponse } from "@/types/Auth";
import { AuthenticatedUser } from "@/types/User";
import { Permission } from "@/types/Permission";

/**
 * Hook for login
 */
export function useLogin(): UseMutationResult<LoginResponse, Error, LoginRequest, unknown> {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginRequest, unknown>({
    mutationFn: async (credentials: LoginRequest) => {
      const res = await authService.login(credentials);
      return res;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

/**
 * Hook to fetch current user
 */
export function useCurrentUser() {
  return useQuery<AuthenticatedUser | null>({
    queryKey: ["currentUser"],
    queryFn: authService.fetchCurrentUser,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 1,
  });
}

/**
 * Hook for logout
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    authService.logout();
    queryClient.removeQueries({ queryKey: ["currentUser"] });
  };
}

/**
 * Hook to check if current user has a permission
 */
export const useHasPermission = (endpoint: string): boolean => {
  const { data: user } = useCurrentUser();
  return !!user?.permissions?.some((p: Permission) => p.endpoint === endpoint);
};

/**
 * Hook for forgot password
 */

export function useForgotPassword(): UseMutationResult<
  ForgotPasswordResponse,
  Error,
  ForgotPasswordRequest,
  unknown
> {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordRequest, unknown>({
    mutationFn: async (data: ForgotPasswordRequest) => {
      const res = await authService.forgotPassword(data);
      return res;
    },
  });
}

/**
 * Hook for resetting password
 */
export function useResetPassword(): UseMutationResult<
  ResetPasswordResponse,
  Error,
  ResetPasswordRequest,
  unknown
> {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordRequest, unknown>({
    mutationFn: async (data: ResetPasswordRequest) => {
      const res = await authService.resetPassword(data);
      return res;
    },
  });
}
