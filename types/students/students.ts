export enum StudentStatus {
  AVAILABLE = 1,
  RESERVED = 2,
  HIRED = 3,
}

export interface ImportedStudentData {
  email: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  bonusProjectUrls: string[];
}

export enum ExpectedTypeWork {
  AT_LOCATION,
  READY_TO_MOVE,
  REMOTE,
  HYBRID,
  IRRELEVANT,
}

export enum ExpectedContractType {
  EMPLOYMENT_CONTRACT,
  B_TO_B,
  COMMISSION_CONTRACT_OR_SPECIFIC_TASK_CONTRACT,
}

interface UrlEntity {
  id: string;
  url: string;
}

export interface StudentProfileRegister {
  tel: string | undefined;
  firstName: string;
  lastName: string;
  githubUsername: string;
  portfolioUrls: string[] | [];
  projectUrls: string[];
  bio: string | undefined;
  expectedTypeWork: ExpectedTypeWork;
  targetWorkCity: string | undefined;
  expectedContractType: ExpectedContractType;
  expectedSalary: string | undefined;
  canTakeApprenticeship: boolean;
  monthsOfCommercialExp: number;
  education: string | undefined;
  workExperience: string | undefined;
  courses: string | undefined;
}

export interface StudentProfileUpdate extends StudentProfileRegister {
  email: string;
}

export interface AvailableStudentRes
  extends Omit<ImportedStudentData, 'email' | 'bonusProjectUrls'> {
  id: string;
  studentInfo: Pick<
    StudentProfileRegister,
    | 'firstName'
    | 'lastName'
    | 'expectedTypeWork'
    | 'targetWorkCity'
    | 'expectedContractType'
    | 'expectedSalary'
    | 'canTakeApprenticeship'
    | 'workExperience'
    | 'monthsOfCommercialExp'
  >;
}

export interface ReservedStudentRes extends AvailableStudentRes {
  bookingDateTo: Date;
}

export interface AvailableStudentWhitPaginationRes {
  students: AvailableStudentRes[];
  pages: {
    maxPerPage: number;
    currentPage: number;
    studentsCount: number;
    totalPages: number;
  };
}

// export interface DetailedStudentDataRes
//   extends ImportedStudentData,
//     StudentProfileRegister {
//   status: StudentStatus;
//   user: { email: string };
// }

interface StudentInfo
  extends Omit<StudentProfileRegister, 'portfolioUrls' | 'projectUrls'> {
  portfolioUrls: UrlEntity[] | [];
  projectUrls: UrlEntity[];
}

export interface DetailedStudentDataRes
  extends Omit<ImportedStudentData, 'bonusProjectUrls'> {
  id: string;
  status: StudentStatus;
  email: string;
  studentInfo: StudentInfo;
  bonusProjectUrls: UrlEntity[];
}

export interface FilteringOptions {
  courseCompletion: number | null;
  courseEngagement: number | null;
  projectDegree: number | null;
  teamProjectDegree: number | null;
  expectedContractType: ExpectedContractType | null;
  expectedSalaryFrom: number | null;
  expectedSalaryTo: number | null;
  canTakeApprenticeship: boolean | null;
  monthsOfCommercialExp: number | null;
}
