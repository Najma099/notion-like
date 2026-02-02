
export interface AuthUser {
  id: number;
  email: string;
  name: string;
}

export interface AuthUserWithPassword extends AuthUser {
  password: string;
}