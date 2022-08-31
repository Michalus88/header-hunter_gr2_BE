import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentInfo } from './student-info.entity';

@Entity()
export class StudentPortfolioUrl extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, length: 255 })
  url: string;

  @ManyToOne((type) => StudentInfo, (entity) => entity.portfolioUrls)
  studentInfo: StudentInfo;
}
