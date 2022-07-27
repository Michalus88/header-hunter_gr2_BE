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

  @Column({ length: 36 })
  userId: string;

  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255 })
  lastName: string;

  @Column({
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    length: 255,
  })
  company: string;

  @Column({
    type: 'smallint',
  })
  maxReservedStudents: number;

  @OneToMany(() => StudentProfile, (entity) => entity.hrProfile)
  reservedStudents: StudentProfile[];
}
