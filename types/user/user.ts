export enum Role {
  STUDENT = 1,
  HR = 2,
  ADMIN = 3,
}

export interface User {
  id: string;
  isActive: boolean;
  role: Role;
  email: string;
  password: string;
}

export type UserRes = Omit<User, 'password' | 'isActive'>;
