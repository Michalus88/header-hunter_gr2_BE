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
  salt: string;
  registerToken: string | null;
}

export type UserRes = Omit<
  UserData,
  'password' | 'isActive' | 'salt' | 'registerToken'
>;

export interface StudentRegisterResponse {
  numberOfStudentsToRegister: number;
  numberOfSuccessfullyRegistered: number;
  emailsAlreadyRegistered: {
    number: number;
    emails: string[];
  };
}
