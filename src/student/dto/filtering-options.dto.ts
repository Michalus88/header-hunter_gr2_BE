import { IsNotEmpty, IsPositive } from 'class-validator';
import {
  CanTakeApprenticeship,
  ExpectedContractType,
  ExpectedTypeWork,
  FilteringOptions,
} from 'types';

export class FilteringOptionsDto implements FilteringOptions {
  @IsNotEmpty()
  @IsPositive()
  canTakeApprenticeship: CanTakeApprenticeship;

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
  expectedTypeWork: ExpectedTypeWork | null;

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
