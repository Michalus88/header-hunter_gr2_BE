import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { HrProfile } from './hr-profile.entity';
import { LoggedUserRes } from '../../types';
import { DataSource } from 'typeorm';
import { StudentService } from '../student/student.service';
import { ReservationService } from '../reservation/reservation.service';

@Injectable()
export class HrService {
  constructor(
    private dataSource: DataSource,
    private studentService: StudentService,
    private reservationService: ReservationService,
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
    await this.reservationService.isStudentBooked(hrProfile, studentId);
    await this.reservationService.add(hrProfile, studentProfile);

    return {
      codeStatus: 200,
      message: `Student with id ${studentId} booked.`,
    };
  }

  async getBookedStudents(user: User) {
    await this.reservationService.verificationStudentBookingTime();
    const hr = await this.dataSource
      .createQueryBuilder()
      .select('hr.id')
      .from(HrProfile, 'hr')
      .where('hr.user = :userId', { userId: user.id })
      .getOne();

    return this.reservationService.getBookedStudents(hr);
  }
}
