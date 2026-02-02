import { AuthUser } from "../types/user";

export const enum Header {
  AUTHORIZATION = "authorization",
}

export function getUserData(user: AuthUser) {
  const { id, name, email } = user;
  return { id, name, email };
}
