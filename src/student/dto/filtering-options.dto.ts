import { IsNotEmpty, IsPositive } from 'class-validator';
import { ExpectedContractType, FilteringOptions } from 'types';

export class FilteringOptionsDto implements FilteringOptions {
  @IsNotEmpty()
  @IsPositive()
  canTakeApprenticeship: boolean | null;

  @IsNotEmpty()
  @IsPositive()
  courseCompletion: number | null;

  @IsNotEmpty()
  @IsPositive()
  courseEngagement: number | null;

  @IsNotEmpty()
  expectedContractType: ExpectedContractType | null;

  @IsNotEmpty()
  @IsPositive()
  expectedSalaryFrom: number | null;

  @IsNotEmpty()
  @IsPositive()
  expectedSalaryTo: number | null;

  @IsNotEmpty()
  @IsPositive()
  monthsOfCommercialExp: number | null;

  @IsNotEmpty()
  @IsPositive()
  projectDegree: number | null;

  @IsNotEmpty()
  @IsPositive()
  teamProjectDegree: number | null;
}