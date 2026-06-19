export type RegisterUserPayload = {
  email: string;
  password: string;
  username: string;
};

export type LoginUserPayload = Pick<RegisterUserPayload, "email" | "password">;

export type UserDto = {
  createdAt: string;
  email: string;
  id: string;
  username: string;
};

export type UserResponse = {
  data: UserDto;
};
