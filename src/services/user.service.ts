import { User } from "../types";
import api from "./api";

interface IRegisterResponse {
  success: boolean;
  message: string;
  user: User;
}

interface ILoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export const userService = {
  register: async (
    userData: Omit<User, "id" | "createdAt" | "updatedAt" | "status">
  ): Promise<IRegisterResponse> => {
    const response = await api.post("/users/register", userData);
    return response;
  },

  login: async (email: string, password: string): Promise<ILoginResponse> => {
    const response = await api.post("/users/login", { email, password });
    return response;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post("/users/logout");
    return response;
  },

  getCurrentUser: async (): Promise<{
    success: boolean;
    user: User;
  } | null> => {
    try {
      const response = await api.get("/users/me");
      return response;
    } catch (error) {
      return null;
    }
  },
};
