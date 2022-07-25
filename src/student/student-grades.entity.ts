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

  @IsNotEmpty()
  @Column({ type: 'smallint' })
  courseCompletion: number;

  @IsNotEmpty()
  @Column({ type: 'smallint' })
  courseEngagement: number;

  @IsNotEmpty()
  @Column({ type: 'smallint' })
  projectDegree: number;

  @IsNotEmpty()
  @Column({ type: 'smallint' })
  teamProjectDegree: number;

  @OneToOne(() => StudentProfile)
  studentProfile: StudentProfile;
}
