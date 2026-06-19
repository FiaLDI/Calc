import { makeAutoObservable, runInAction } from "mobx";

import { ApiError } from "@/shared/api/client";

import { AuthApi } from "./api";
import type {
  AuthStatus,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "./types";

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

  async checkSession() {
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
    await this.authenticate(() => AuthApi.login(payload));
  }

  async register(payload: RegisterPayload) {
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
      await AuthApi.logout();
    } catch {
      // A local logout still clears application state if the server is offline.
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
