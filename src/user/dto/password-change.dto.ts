import { IsNotEmpty } from 'class-validator';
import { PasswordChange } from 'types';

export class PasswordChangeDto implements PasswordChange {
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  newPassword: string;

  @IsNotEmpty()
  repeatPassword: string;
}
