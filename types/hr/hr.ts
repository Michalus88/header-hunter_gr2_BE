import { StudentRes } from '../students';

export interface HrProfileRegister {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  maxReservedStudents: number;
}

export interface HrRes extends Omit<HrProfileRegister, 'password'> {
  id: string;
  reservedStudents: StudentRes[] | [];
}
