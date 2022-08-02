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

export interface StudentProfileRegister {
  tel: string | undefined;
  firstName: string;
  lastName: string;
  githubUsername: string;
  portfolioUrls: string[] | undefined;
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

export interface AvailableStudentRes
  extends Omit<ImportedStudentData, 'email' | 'bonusProjectUrls'>,
    Pick<
      StudentProfileRegister,
      | 'expectedTypeWork'
      | 'targetWorkCity'
      | 'expectedContractType'
      | 'expectedSalary'
      | 'canTakeApprenticeship'
      | 'workExperience'
    > {}

export interface StudentDataRes
  extends ImportedStudentData,
    StudentProfileRegister {
  id: string;
  userId: string;
  status: StudentStatus;
}
