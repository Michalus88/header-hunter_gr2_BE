import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { StudentProfile } from './student-profile.entity';

@Entity()
export class BonusProjectUrl extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36 })
  userId: string;

  @Column({ length: 255 })
  url: string;

  @ManyToOne((type) => StudentProfile, (entity) => entity.bonusProjectUrls)
  studentProfile: StudentProfile;
}
