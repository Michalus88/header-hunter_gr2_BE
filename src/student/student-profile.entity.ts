import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentStatus } from 'types';
import { BonusProjectUrl } from './student-bonus-project-url.entity';
import { User } from '../user/user.entity';
import { StudentInfo } from './student-info.entity';
import { Reservation } from '../reservation/reservation.entity';

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

  @OneToMany(() => Reservation, (reservations) => reservations.studentProfile)
  reservations: Reservation[];
}
