import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Max, Min } from 'class-validator';
import { HrProfileRegister } from 'types';

export class HrRegisterDto implements HrProfileRegister {
  @ApiProperty()
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
  @Max(999)
  @IsNotEmpty()
  maxReservedStudents: number;
}
