import axiosInstance from "@/lib/axios";
import { User } from "@/types/User";

export const getUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get<{ data: User[] }>("/users");
  return response.data.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await axiosInstance.get<{ data: User }>(`/users/${id}`);
  return response.data.data;
};

export const createUser = async (data: Partial<User>): Promise<User> => {
  const response = await axiosInstance.post<{ data: User }>("/users", data);
  return response.data.data;
};

export const updateUser = async (id: number, data: Partial<User>): Promise<User> => {
  const response = await axiosInstance.patch<{ data: User }>(`/users/${id}`, data);
  return response.data.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/users/${id}`);
};
