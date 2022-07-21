export interface User {
  id: string;
  isActive: boolean;
  role: Role;
  email: string;
  password: string;
}

export enum Role {
  ADMIN = 1,
  STUDENT = 2,
  HR = 3,
}

export type UserRes = Omit<User, 'password' | 'isActive'>;
