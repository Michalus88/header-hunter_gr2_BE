import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  ExpectedContractType,
  ExpectedTypeWork,
  StudentProfileRegister,
} from 'types';
import { StudentProjectUrl } from './student-project-url.entity';
import { StudentPortfolioUrl } from './student-portfolio-url.entity';
import { StudentProfile } from './student-profile.entity';

@Entity()
export class StudentInfo
  extends BaseEntity
  implements Omit<StudentProfileRegister, 'projectUrls' | 'portfolioUrls'>
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => StudentProfile)
  studentProfile: StudentProfile;

  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255 })
  lastName: string;

  @Column({ nullable: true, length: 9 })
  tel: string;

  @Column({ unique: true })
  githubUsername: string;

  @OneToMany(() => StudentPortfolioUrl, (entity) => entity.studentInfo, {
    eager: true,
  })
  portfolioUrls: StudentPortfolioUrl[];

  @OneToMany(() => StudentProjectUrl, (entity) => entity.studentInfo, {
    eager: true,
  })
  projectUrls: StudentProjectUrl[];

  @Column({ nullable: true, length: 1000, default: null })
  bio: string;

  @Column({
    nullable: true,
    type: 'enum',
    enum: ExpectedTypeWork,
    default: null,
  })
  expectedTypeWork: ExpectedTypeWork;

  @Column({ nullable: true, length: 30, default: null })
  targetWorkCity: string;

  @Column({
    nullable: true,
    type: 'enum',
    enum: ExpectedContractType,
    default: null,
  })
  expectedContractType: ExpectedContractType;

  @Column({ nullable: true, length: 5, default: null })
  expectedSalary: string;

  @Column({ default: false })
  canTakeApprenticeship: boolean;

  @Column({ type: 'tinyint', default: 0 })
  monthsOfCommercialExp: number;

  @Column({ type: 'text', nullable: true })
  education: string;

  @Column({ type: 'text', nullable: true })
  workExperience: string;

  @Column({ type: 'text', nullable: true })
  courses: string;
}
