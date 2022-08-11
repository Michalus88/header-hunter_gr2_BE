import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HrProfileRegister } from 'types';
import { User } from '../user/user.entity';
import { Reservation } from '../reservation/reservation.entity';

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

  @OneToMany(() => Reservation, (reservations) => reservations.hrProfile)
  reservations: Reservation[];
}
