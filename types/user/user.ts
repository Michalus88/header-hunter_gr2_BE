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

export type UserRes = Pick<UserData, 'id' | 'role' | 'email'>;

export interface LoggedUserRes extends UserRes {
  firstName: string;
  lastName: string;
}

export interface StudentRegisterResponse {
  numberOfStudentsToRegister: number;
  numberOfSuccessfullyRegistered: number;
  emailsAlreadyRegistered: {
    number: number;
    emails: string[];
  };
  incorrectStudentData: {
    number: number;
    emails: string[];
  };
}

export interface Login {
  email: string;
  password: string;
}

export interface PasswordChange {
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
}

export interface EmailChange {
  oldEmail: string;
  newEmail: string;
  repeatNewEmail: string;
}

export interface PasswordRecovery {
  email: string;
}
