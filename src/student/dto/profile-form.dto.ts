import { IsNotEmpty, Max, MaxLength, Min, IsOptional } from 'class-validator';
import {
  ExpectedContractType,
  ExpectedTypeWork,
  StudentProfileRegister,
} from 'types';

export class StudentProfileDto implements StudentProfileRegister {
  @IsOptional()
  tel: string | null;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  githubUsername: string;

  @IsOptional()
  portfolioUrls: string[] | [];

  @IsNotEmpty()
  projectUrls: string[];

  @IsOptional()
  @MaxLength(65535)
  bio: string | null;

  @IsNotEmpty()
  @Min(0)
  @Max(4)
  expectedTypeWork: ExpectedTypeWork;

  @IsOptional()
  @MaxLength(30)
  targetWorkCity: string;

  @IsNotEmpty()
  @Min(0)
  @Max(3)
  expectedContractType: ExpectedContractType;

  @IsOptional()
  @MaxLength(5)
  expectedSalary: string;

  @IsOptional()
  @IsNotEmpty()
  canTakeApprenticeship: boolean | null;

  @IsOptional()
  @Min(0)
  @Max(780)
  monthsOfCommercialExp: number;

  @IsOptional()
  @MaxLength(65535)
  education: string | null;

  @IsOptional()
  @MaxLength(65535)
  workExperience: string | null;

  @IsOptional()
  @MaxLength(65535)
  courses: string | null;
}
