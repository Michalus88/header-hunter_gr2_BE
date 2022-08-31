import { IsEmail, IsNotEmpty } from 'class-validator';
import { PasswordRecovery } from 'types';

export class PasswordRecoveryDto implements PasswordRecovery {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
