import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from '../user/user.entity';
import { HrProfile } from './hr-profile.entity';
import { StudentStatus } from '../../types';
import { DataSource } from 'typeorm';
import { StudentService } from '../student/student.service';
import { setMaxReservationTime } from '../utils/set-max-reservation-time';

@Injectable()
export class HrService {
  constructor(
    private dataSource: DataSource,
    private studentService: StudentService,
  ) {}

  async bookingStudent(user: User, studentId: string) {
    const studentProfile = await this.studentService.isStudentBooked(studentId);
    const hrProfile = await this.dataSource
      .createQueryBuilder()
      .select('hrProfile')
      .from(HrProfile, 'hrProfile')
      .where('hrProfile.user = :userId', { userId: user.id })
      .getOne();
    if (!hrProfile) {
      throw new ForbiddenException(
        'You are not logged in or Your data has been modified.',
      );
    }
    console.log(setMaxReservationTime(10));
    studentProfile.hrProfile = hrProfile;
    studentProfile.status = StudentStatus.RESERVED;
    studentProfile.bookingDateTo = setMaxReservationTime(10);
    await studentProfile.save();
    return {
      codeStatus: 200,
      message: `Student with id ${studentId} booked.`,
    };
  }
}
