import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentStatus } from 'types';
import { BonusProjectUrl } from './student-bonus-project-url.entity';
import { HrProfile } from '../hr/hr-profile.entity';
import { User } from '../user/user.entity';
import { StudentInfo } from './student-info.entity';

@Entity()
export class StudentProfile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => StudentInfo)
  @JoinColumn()
  studentInfo: StudentInfo;

  @Column({
    type: 'enum',
    enum: StudentStatus,
    default: StudentStatus.AVAILABLE,
  })
  status: StudentStatus;

  @Column({ type: 'float', precision: 3, scale: 2 })
  courseCompletion: number;

  @Column({ type: 'float', precision: 3, scale: 2 })
  courseEngagement: number;

  @Column({ type: 'float', precision: 3, scale: 2 })
  projectDegree: number;

  @Column({ type: 'float', precision: 3, scale: 2 })
  teamProjectDegree: number;

  @OneToMany(() => BonusProjectUrl, (entity) => entity.studentProfile)
  bonusProjectUrls: BonusProjectUrl[];

  @Column({ type: 'datetime', nullable: true })
  bookingDateTo: Date;

  @ManyToMany((type) => HrProfile, (entity) => entity.reservedStudents)
  @JoinTable()
  hrProfile: HrProfile[];
}
