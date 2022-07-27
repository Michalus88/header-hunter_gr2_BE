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
  tel: string | null;
  githubUsername: string;
  portfolioUrls: URL[] | null;
  projectUrls: URL[];
  bio: string | null;
  expectedTypeWork: ExpectedTypeWork;
  targetWorkCity: string | null;
  expectedContractType: ExpectedContractType;
  expectedSalary: string | null;
  canTakeApprenticeship: boolean;
  monthsOfCommercialExp: number;
  education: string | null;
  workExperience: string | null;
  courses: string | null;
}

export interface StudentData
  extends ImportedStudentData,
    Omit<StudentProfileRegister, 'email'> {
  id: string;
  userId: string;
  status: StudentStatus;
}

export type StudentRes = Omit<StudentData, 'password'>;
