export enum Role {
  STUDENT = 1,
  HR = 2,
  ADMIN = 3,
}

export interface UserData {
  id: string;
  isActive: boolean;
  role: Role;
  email: string;
  password: string;
}

export type UserRes = Omit<UserData, 'password' | 'isActive'>;
