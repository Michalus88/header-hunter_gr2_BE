import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { ImportedStudentData } from 'types';
import { StudentProfile } from './student-profile.entity';

@Entity()
export class StudentGrades
  extends BaseEntity
  implements Omit<ImportedStudentData, 'email' | 'bonusProjectUrls'>
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', precision: 3, scale: 2 })
  courseCompletion: number;

  @Column({ type: 'float', precision: 3, scale: 2 })
  courseEngagement: number;

  @Column({ type: 'float', precision: 3, scale: 2 })
  projectDegree: number;

  @Column({ type: 'float', precision: 3, scale: 2 })
  teamProjectDegree: number;

  @OneToOne(() => StudentProfile)
  studentProfile: StudentProfile;
}
