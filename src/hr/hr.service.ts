import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from '../user/user.entity';
import { HrProfile } from './hr-profile.entity';
import { FilteringOptions, LoggedUserRes, StudentStatus } from '../../types';
import { DataSource } from 'typeorm';
import { StudentService } from '../student/student.service';
import { ReservationService } from '../reservation/reservation.service';
import { FilteringOptionsDto } from '../student/dto/filtering-options.dto';
import { filteringQueryBuilder } from '../utils/filtering-query-builder';

@Injectable()
export class HrService {
  constructor(
    private dataSource: DataSource,
    private studentService: StudentService,
    private reservationService: ReservationService,
  ) {}

  async getMe(user: User): Promise<LoggedUserRes> {
    const hr = await this.extractedHrFieldsFromUser(user, [
      'hr.firstName',
      'hr.lastName',
    ]);
    return { id: user.id, role: user.role, ...hr, email: user.email };
  }

  async bookingStudent(user: User, studentId: string) {
    const studentProfile = await this.studentService.getAvailableStudent(
      studentId,
    );
    const hr = await this.extractedHrFieldsFromUser(user);
    await this.reservationService.isStudentBooked(hr, studentId);
    await this.reservationService.add(hr, studentProfile);

    return {
      codeStatus: 200,
      message: `Student with id ${studentId} booked.`,
    };
  }

  async getBookedStudents(user: User, filteringOptions?: FilteringOptions) {
    await this.reservationService.verificationStudentBookingTime();
    const hr = await this.extractedHrFieldsFromUser(user, ['hr.id']);
    const { id } = hr;
    return this.reservationService.getBookedStudents(id);
  }

  async getFilteredBookingStudents(
    user: User,
    filteringOptions: FilteringOptionsDto,
  ) {
    const hr = await this.extractedHrFieldsFromUser(user, ['hr.id']);
    const { id } = hr;
    const {
      expectedContractType,
      teamProjectDegree,
      canTakeApprenticeship,
      courseEngagement,
      courseCompletion,
      monthsOfCommercialExp,
      projectDegree,
    } = filteringOptions;
    const parameters = {
      expectedContractType,
      teamProjectDegree,
      canTakeApprenticeship,
      courseEngagement,
      courseCompletion,
      monthsOfCommercialExp,
      projectDegree,
    };
    const query = filteringQueryBuilder(filteringOptions);

    return this.reservationService.getBookedStudents(id, query, parameters);
  }

  async extractedHrFieldsFromUser(user: User, extractedFields: string[] = []) {
    const selections: string[] = extractedFields;
    if (extractedFields.length === 0) {
      selections.push('hr');
    }
    try {
      const hr = await this.dataSource
        .createQueryBuilder()
        .select(selections)
        .from(HrProfile, 'hr')
        .where('hr.user = :userId', { userId: user.id })
        .getOne();
      if (!hr) {
        throw new BadRequestException('User with hr role does not exist.');
      }

      return hr;
    } catch (error) {
      throw new BadRequestException('Wrong field name.');
    }
  }
}
