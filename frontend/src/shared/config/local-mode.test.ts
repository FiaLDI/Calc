import { afterEach, describe, expect, it } from "vitest";

import {
  disableLocalMode,
  enableLocalMode,
  isLocalMode,
  isLocalUserId,
  LOCAL_MODE_STORAGE_KEY,
  LOCAL_USER_ID,
} from "./local-mode";

describe("local-mode preference", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("is off by default", () => {
    expect(isLocalMode()).toBe(false);
  });

  it("enable/disable toggles localStorage preference", () => {
    enableLocalMode();
    expect(localStorage.getItem(LOCAL_MODE_STORAGE_KEY)).toBe("1");
    expect(isLocalMode()).toBe(true);

    disableLocalMode();
    expect(localStorage.getItem(LOCAL_MODE_STORAGE_KEY)).toBeNull();
    expect(isLocalMode()).toBe(false);
  });

  it("recognizes the local user id", () => {
    expect(isLocalUserId(LOCAL_USER_ID)).toBe(true);
    expect(isLocalUserId("other")).toBe(false);
  });
});
