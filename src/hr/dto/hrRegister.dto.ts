import { IsEmail, IsNotEmpty, Min } from 'class-validator';
import { HrProfileRegister } from 'types';

export class HrRegisterDto implements HrProfileRegister {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  company: string;

  @Min(1)
  @IsNotEmpty()
  maxReservedStudents: number;
}
