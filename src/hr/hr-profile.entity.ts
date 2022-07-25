import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { HrProfileRegister } from 'types';
import { StudentProfile } from '../student/student-profile.entity';

@Entity()
export class HrProfile extends BaseEntity implements HrProfileRegister {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @Column({ length: 255 })
  firstName: string;

  @IsNotEmpty()
  @Column({ length: 255 })
  lastName: string;

  @Column({
    length: 255,
    unique: true,
  })
  email: string;

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

  @OneToMany(() => StudentProfile, (entity) => entity.bookingProfileHr)
  reservedStudents: StudentProfile[];
}
