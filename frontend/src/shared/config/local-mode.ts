export const LOCAL_USER_ID = "local";
export const LOCAL_MODE_STORAGE_KEY = "calc:local-mode";

/** Runtime preference: user chose «без аккаунта». Survives reload via localStorage. */
export const isLocalMode = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(LOCAL_MODE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

export const enableLocalMode = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_MODE_STORAGE_KEY, "1");
};

export const disableLocalMode = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(LOCAL_MODE_STORAGE_KEY);
};

export const isLocalUserId = (userId: string) => userId === LOCAL_USER_ID;
