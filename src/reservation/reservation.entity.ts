import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { HrProfileRegister } from 'types';
import { StudentProfile } from '../student/student-profile.entity';
import { User } from '../user/user.entity';
import { HrProfile } from '../hr/hr-profile.entity';

@Entity()
@Unique(['hrProfile', 'studentProfile'])
export class Reservation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bookingDateTo: Date;

  @ManyToOne(() => HrProfile, (hrProfile) => hrProfile.reservations)
  hrProfile: HrProfile;

  @ManyToOne(
    () => StudentProfile,
    (studentProfile) => studentProfile.reservations,
    { eager: true },
  )
  studentProfile: StudentProfile;
}
