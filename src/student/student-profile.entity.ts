import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  ExpectedContractType,
  ExpectedTypeWork,
  StudentProfileRegister,
} from 'types';
import { IsNotEmpty } from 'class-validator';
import { StudentProjectUrl } from './student-project-url.entity';
import { StudentGrades } from './student-grades.entity';
import { BonusProjectUrl } from './student-bonus-project-url.entity';
import { StudentPortfolioUrl } from './student-portfolio-url.entity';
import { HrProfile } from '../hr/hr-profile.entity';

@Entity()
export class StudentProfile
  extends BaseEntity
  implements
    Omit<
      StudentProfileRegister,
      'portfolioUrls' | 'bonusProjectUrls' | 'projectUrls'
    >
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
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

  @Column({ nullable: true, length: 9 })
  tel: string;

  @IsNotEmpty()
  @Column({ nullable: true })
  githubUsername: string;

  @OneToOne(() => StudentGrades)
  @JoinColumn()
  grades: StudentGrades;

  @OneToMany(() => StudentPortfolioUrl, (entity) => entity.studentProfile)
  portfolioUrls: StudentPortfolioUrl[];

  @OneToMany(() => StudentProjectUrl, (entity) => entity.studentProfile)
  projectUrls: StudentProjectUrl[];

  @OneToMany(() => BonusProjectUrl, (entity) => entity.studentProfile)
  bonusProjectUrls: BonusProjectUrl[];

  @Column({ nullable: true, length: 1000 })
  bio: string;

  @IsNotEmpty()
  @Column({ nullable: true })
  expectedTypeWork: ExpectedTypeWork;

  @IsNotEmpty()
  @Column({ nullable: true, length: 50 })
  targetWorkCity: string;

  @IsNotEmpty()
  @Column()
  expectedContractType: ExpectedContractType;

  @IsNotEmpty()
  @Column({ nullable: true })
  expectedSalary: number;

  @IsNotEmpty()
  @Column()
  canTakeApprenticeship: boolean;

  @IsNotEmpty()
  @Column({ default: 0 })
  monthsOfCommercialExp: number;

  @Column({ type: 'multilinestring', nullable: true })
  education: string;

  @Column({ type: 'multilinestring', nullable: true })
  workExperience: string;

  @Column({ type: 'multilinestring', nullable: true })
  courses: string;

  @ManyToOne((type) => HrProfile, (entity) => entity.reservedStudents)
  @JoinColumn()
  hrProfile: HrProfile;
}
