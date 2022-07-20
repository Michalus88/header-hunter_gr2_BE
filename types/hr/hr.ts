import { Student } from '../students';

export interface HrRegister {
    email: string;
    password: string;
    fullName: string;
    company: string;
    maxReservedStudents: number;
}

export interface HrRes extends Omit<HrRegister, 'password'> {
    id: string;
    reservedStudents: Student[] | [];
}
