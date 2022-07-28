import { IsNotEmpty, IsPositive } from 'class-validator';
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

  portfolioUrls: string[] | undefined;

  @IsNotEmpty()
  projectUrls: string[];

  bio: string;

  @IsNotEmpty()
  expectedTypeWork: ExpectedTypeWork;

  targetWorkCity: string;

  @IsNotEmpty()
  expectedContractType: ExpectedContractType;

  expectedSalary: string;

  canTakeApprenticeship: boolean;

  monthsOfCommercialExp: number;

  education: string;

  workExperience: string;

  courses: string;
}
