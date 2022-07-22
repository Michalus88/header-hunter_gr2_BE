import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role, UserData } from 'types';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class User extends BaseEntity implements UserData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: false,
  })
  isActive: boolean;

  @Column({ nullable: true, length: 255 })
  firstName: string;

  @Column({ nullable: true, length: 255 })
  lastName: string;

  @Column({
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    length: 255,
  })
  password: string;

  @IsNotEmpty()
  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @IsNotEmpty()
  @Column({
    length: 255,
  })
  salt: string;

  @Column({
    length: 255,
    nullable: true,
  })
  registerToken: string;
}
