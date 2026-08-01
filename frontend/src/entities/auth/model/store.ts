import { makeAutoObservable, runInAction } from "mobx";

import { ApiError } from "@/shared/api/client";
import {
  disableLocalMode,
  enableLocalMode,
  isLocalMode,
  LOCAL_USER_ID,
} from "@/shared/config/local-mode";

import { AuthApi } from "./api";
import type {
  AuthStatus,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "./types";

export const LOCAL_USER: AuthUser = {
  createdAt: "1970-01-01T00:00:00.000Z",
  email: "local@calc",
  id: LOCAL_USER_ID,
  username: "Локально",
};

const getErrorMessage = (error: unknown) =>
  error instanceof ApiError ? error.message : "Не удалось связаться с сервером.";

class AuthStore {
  user: AuthUser | null = null;
  status: AuthStatus = "loading";
  isSubmitting = false;
  error = "";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isLocal() {
    return this.user?.id === LOCAL_USER_ID;
  }

  enterLocalSession() {
    enableLocalMode();
    this.user = LOCAL_USER;
    this.status = "authenticated";
    this.error = "";
  }

  async checkSession() {
    if (isLocalMode()) {
      runInAction(() => {
        this.user = LOCAL_USER;
        this.status = "authenticated";
        this.error = "";
      });
      return;
    }

    this.status = "loading";
    this.error = "";

    try {
      const user = await AuthApi.getCurrentUser();
      runInAction(() => {
        this.user = user;
        this.status = "authenticated";
      });
    } catch (error) {
      runInAction(() => {
        this.user = null;
        this.status = "anonymous";
        this.error =
          error instanceof ApiError && error.status === 401
            ? ""
            : getErrorMessage(error);
      });
    }
  }

  async login(payload: LoginPayload) {
    disableLocalMode();
    await this.authenticate(() => AuthApi.login(payload));
  }

  async register(payload: RegisterPayload) {
    disableLocalMode();
    await this.authenticate(() => AuthApi.register(payload));
  }

  private async authenticate(request: () => Promise<AuthUser>) {
    this.isSubmitting = true;
    this.error = "";

    try {
      const user = await request();
      runInAction(() => {
        this.user = user;
        this.status = "authenticated";
      });
    } catch (error) {
      runInAction(() => {
        this.error = getErrorMessage(error);
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isSubmitting = false;
      });
    }
  }

  async logout() {
    this.isSubmitting = true;

    try {
      if (this.isLocal) {
        disableLocalMode();
      } else {
        try {
          await AuthApi.logout();
        } catch {
          // Clear local session even if the server is offline.
        }
      }
    } finally {
      runInAction(() => {
        this.clearSession();
        this.isSubmitting = false;
      });
    }
  }

  clearError() {
    this.error = "";
  }

  clearSession() {
    this.user = null;
    this.status = "anonymous";
    this.error = "";
  }
}

export const createAuthStore = () => new AuthStore();
