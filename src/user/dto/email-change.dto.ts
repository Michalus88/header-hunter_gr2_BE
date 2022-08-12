import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { EmailChange } from 'types';

export class EmailChangeDto implements EmailChange {
  @ApiProperty()
  @IsNotEmpty()
  oldEmail: string;

  @IsNotEmpty()
  newEmail: string;

  @IsNotEmpty()
  repeatNewEmail: string;
}
