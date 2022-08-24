import { IsNotEmpty, Max, MaxLength, Min } from 'class-validator';

import {
  ExpectedContractType,
  ExpectedTypeWork,
  StudentProfileRegister,
} from 'types';

export class StudentProfileUpdateDto implements StudentProfileRegister {
  @MaxLength(9)
  tel: string;

  @IsNotEmpty()
  @MaxLength(255)
  firstName: string;

  @IsNotEmpty()
  @MaxLength(255)
  lastName: string;

  @IsNotEmpty()
  @MaxLength(255)
  githubUsername: string;

  portfolioUrls: string[] | undefined;

  @IsNotEmpty()
  projectUrls: string[];

  @MaxLength(1000)
  bio: string;

  @IsNotEmpty()
  @Min(0)
  @Max(4)
  expectedTypeWork: ExpectedTypeWork;

  @MaxLength(30)
  targetWorkCity: string;

  @IsNotEmpty()
  @Min(0)
  @Max(3)
  expectedContractType: ExpectedContractType;

  @MaxLength(5)
  expectedSalary: string;

  canTakeApprenticeship: boolean;

  @Min(0)
  @Max(780) //780 month = 65 years
  monthsOfCommercialExp: number;

  education: string;

  workExperience: string;

  courses: string;
}
