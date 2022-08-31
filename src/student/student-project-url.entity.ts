import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentProfile } from './student-profile.entity';
import { StudentInfo } from './student-info.entity';

@Entity()
export class StudentProjectUrl extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  url: string;

  @ManyToOne((type) => StudentInfo, (entity) => entity.projectUrls)
  @JoinColumn()
  studentInfo: StudentInfo;
}
