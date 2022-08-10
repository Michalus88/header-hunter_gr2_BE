import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { HrProfileRegister } from 'types';
import { StudentProfile } from '../student/student-profile.entity';
import { User } from '../user/user.entity';

@Entity()
export class HrProfile
  extends BaseEntity
  implements Omit<HrProfileRegister, 'email'>
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ length: 80 })
  firstName: string;

  @Column({ length: 80 })
  lastName: string;

  @Column({
    length: 255,
  })
  company: string;

  @Column({
    type: 'smallint',
  })
  maxReservedStudents: number;

  @ManyToMany(() => StudentProfile, (entity) => entity.hrProfile)
  reservedStudents: StudentProfile[];
}
