import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { HrProfileRegister } from 'types';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Hr
  extends BaseEntity
  implements Pick<HrProfileRegister, 'company' | 'maxReservedStudents'>
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @Column({
    length: 255,
  })
  company: string;

  @IsNotEmpty()
  @Column({
    type: 'smallint',
  })
  maxReservedStudents: number;
}
