export type AuthUser = {
  createdAt: string;
  email: string;
  id: string;
  username: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  username: string;
};

export type AuthStatus = "loading" | "authenticated" | "anonymous";
