import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role, UserData } from 'types';

@Entity()
export class User extends BaseEntity implements UserData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: false,
  })
  isActive: boolean;

  @Column({
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    length: 255,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

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
