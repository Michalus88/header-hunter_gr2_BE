export enum StudentStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  HIRED = 'hired',
}

export interface ImportedStudentData {
  email: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  bonusProjectUrls: URL[];
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

export interface StudentProfileRegister {
  email: string;
  tel: string | null;
  firstName: string;
  lastName: string;
  githubUsername: string;
  portfolioUrls: URL[] | [];
  projectUrls: URL[];
  bio: string | null;
  expectedTypeWork: ExpectedTypeWork;
  targetWorkCity: string | null;
  expectedContractType: ExpectedContractType;
  expectedSalary: number | null;
  canTakeApprenticeship: boolean;
  monthsOfCommercialExp: number;
  education: string;
  workExperience: string;
  courses: string;
}

export interface StudentData
  extends ImportedStudentData,
    Omit<StudentProfileRegister, 'email'> {
  id: string;
  status: StudentStatus;
}

export type StudentRes = Omit<StudentData, 'password'>;
