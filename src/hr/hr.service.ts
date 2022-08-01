import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { HrProfile } from './hr-profile.entity';
import { StudentStatus } from '../../types';
import { DataSource } from 'typeorm';
import { StudentService } from '../student/student.service';

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

    studentProfile.hrProfile = hrProfile;
    studentProfile.status = StudentStatus.RESERVED;
    studentProfile.bookingDate = new Date();
    await studentProfile.save();
    return {
      codeStatus: 200,
      message: `Student with id ${studentId} booked.`,
    };
  }
}
