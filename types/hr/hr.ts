import { StudentDataRes } from '../students';

export interface HrProfileRegister {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  maxReservedStudents: number;
}

export interface HrRes extends HrProfileRegister {
  id: string;
  reservedStudents: StudentDataRes[] | null;
}
