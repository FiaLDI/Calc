import { fetchFromApi } from "@/shared/api/client";

import type { AuthUser, LoginPayload, RegisterPayload } from "./types";

type UserResponse = {
  data: AuthUser;
};

export const AuthApi = {
  async getCurrentUser() {
    const response = await fetchFromApi<UserResponse>("me", {
      signal: AbortSignal.timeout(5000),
    });
    return response.data;
  },

  async login(payload: LoginPayload) {
    const response = await fetchFromApi<UserResponse, LoginPayload>("login", {
      body: payload,
      method: "POST",
    });
    return response.data;
  },

  async register(payload: RegisterPayload) {
    const response = await fetchFromApi<UserResponse, RegisterPayload>(
      "register",
      {
        body: payload,
        method: "POST",
      }
    );
    return response.data;
  },

  async logout() {
    await fetchFromApi<void>("logout", { method: "POST" });
  },
};
