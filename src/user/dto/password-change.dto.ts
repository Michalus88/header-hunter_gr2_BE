import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PasswordChange } from 'types';

export class PasswordChangeDto implements PasswordChange {
  @ApiProperty()
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  newPassword: string;

  @IsNotEmpty()
  repeatPassword: string;
}
