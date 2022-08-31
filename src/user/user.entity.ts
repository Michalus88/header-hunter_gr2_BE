import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role, UserData } from 'types';
import { StudentProfile } from '../student/student-profile.entity';
import { HrProfile } from '../hr/hr-profile.entity';

@Entity()
export class User extends BaseEntity implements UserData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => StudentProfile)
  studentProfile: StudentProfile;

  @OneToOne(() => HrProfile)
  hrProfile: HrProfile;

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
