import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { PasswordRecovery } from 'types';

export class PasswordRecoveryDto implements PasswordRecovery {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
