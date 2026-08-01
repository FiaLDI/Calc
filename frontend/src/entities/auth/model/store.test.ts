import { afterEach, describe, expect, it, vi } from "vitest";

import {
  disableLocalMode,
  LOCAL_MODE_STORAGE_KEY,
} from "@/shared/config/local-mode";

import { createAuthStore } from "./store";

describe("AuthStore local session feature", () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("enterLocalSession sets preference and synthetic user", () => {
    const store = createAuthStore();
    store.enterLocalSession();

    expect(localStorage.getItem(LOCAL_MODE_STORAGE_KEY)).toBe("1");
    expect(store.isLocal).toBe(true);
    expect(store.status).toBe("authenticated");
    expect(store.user).toMatchObject({
      id: "local",
      username: "Локально",
    });
  });

  it("checkSession restores local session from preference", async () => {
    localStorage.setItem(LOCAL_MODE_STORAGE_KEY, "1");
    const store = createAuthStore();

    await store.checkSession();

    expect(store.isLocal).toBe(true);
    expect(store.user?.id).toBe("local");
  });

  it("logout exits local mode and returns to anonymous", async () => {
    const store = createAuthStore();
    store.enterLocalSession();

    await store.logout();

    expect(store.user).toBeNull();
    expect(store.status).toBe("anonymous");
    expect(localStorage.getItem(LOCAL_MODE_STORAGE_KEY)).toBeNull();
  });

  it("clearSession does not re-enter local mode", () => {
    const store = createAuthStore();
    store.enterLocalSession();
    store.clearSession();

    expect(store.user).toBeNull();
    expect(store.status).toBe("anonymous");
    // preference remains until logout/disable — clearSession is for 401
    expect(localStorage.getItem(LOCAL_MODE_STORAGE_KEY)).toBe("1");
    disableLocalMode();
  });
});
