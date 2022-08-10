import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from '../user/user.entity';
import { HrProfile } from './hr-profile.entity';
import { HrStartDataRes, LoggedUserRes, StudentStatus } from '../../types';
import { DataSource } from 'typeorm';
import { StudentService } from '../student/student.service';
import { setMaxReservationTime } from '../utils/set-max-reservation-time';

@Injectable()
export class HrService {
  constructor(
    private dataSource: DataSource,
    private studentService: StudentService,
  ) {}

  async getMe(user: User): Promise<LoggedUserRes> {
    const hr = await this.dataSource
      .createQueryBuilder()
      .select(['hrProfile.firstName', 'hrProfile.lastName'])
      .from(HrProfile, 'hrProfile')
      .where('hrProfile.user = :userId', { userId: user.id })
      .getOne();

    return { id: user.id, role: user.role, ...hr, email: user.email };
  }

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
    studentProfile.hrProfile.push(hrProfile);
    studentProfile.status = StudentStatus.RESERVED;
    studentProfile.bookingDateTo = setMaxReservationTime(10);
    await studentProfile.save();

    return {
      codeStatus: 200,
      message: `Student with id ${studentId} booked.`,
    };
  }
}
