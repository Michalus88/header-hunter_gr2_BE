import { IsNotEmpty } from 'class-validator';
import {
  ExpectedContractType,
  ExpectedTypeWork,
  StudentProfileRegister,
} from 'types';

export class StudentProfileActivationDto implements StudentProfileRegister {
  tel: string;
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  githubUsername: string;

  portfolioUrls: string[] | [];

  @IsNotEmpty()
  projectUrls: string[];

  bio: string | null;

  expectedTypeWork: ExpectedTypeWork;

  targetWorkCity: string | null;

  expectedContractType: ExpectedContractType | null;

  expectedSalary: string | null;

  canTakeApprenticeship: boolean | null;

  monthsOfCommercialExp: number;

  education: string | null;

  workExperience: string | null;

  courses: string | null;
}
