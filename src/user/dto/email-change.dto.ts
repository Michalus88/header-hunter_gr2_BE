import { IsNotEmpty } from 'class-validator';
import { EmailChange } from 'types';

export class EmailChangeDto implements EmailChange {
  @IsNotEmpty()
  repeatNewEmail: string;

  @IsNotEmpty()
  oldEmail: string;

  @IsNotEmpty()
  newEmail: string;
}
