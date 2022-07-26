import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { HrProfile } from './hr-profile.entity';
import { LoggedUserRes } from '../../types';
import { DataSource } from 'typeorm';
import { StudentService } from '../student/student.service';
import { ReservationService } from '../reservation/reservation.service';
import { FilteringOptionsDto } from '../student/dto/filtering-options.dto';
import { filteringQueryBuilder } from '../utils/filtering-query-builder';
import { pagination } from '../utils/pagination';

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
    return this.reservationService.add(hr, studentProfile);
  }

  async removeStudentReservation(user: User, studentId: string) {
    const hr = await this.extractedHrFieldsFromUser(user);
    return this.reservationService.remove(hr, studentId);
  }

  async getBookedStudents(
    user: User,
    filteringOptions: FilteringOptionsDto,
    maxPerPage: number,
    currentPage: number,
  ) {
    const hr = await this.extractedHrFieldsFromUser(user, ['hr.id']);
    const { id } = hr;
    const {
      expectedContractType,
      expectedTypeWork,
      teamProjectDegree,
      canTakeApprenticeship,
      courseEngagement,
      courseCompletion,
      monthsOfCommercialExp,
      projectDegree,
    } = filteringOptions;
    const parameters = {
      expectedContractType,
      expectedTypeWork,
      teamProjectDegree,
      canTakeApprenticeship,
      courseEngagement,
      courseCompletion,
      monthsOfCommercialExp,
      projectDegree,
    };
    const query = filteringQueryBuilder(filteringOptions);

    const bookingStudents = await this.reservationService.getBookedStudents(
      id,
      query,
      parameters,
    );

    return pagination(bookingStudents, maxPerPage, currentPage);
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
        console.error('User with hr role does not exist.');
      }

      return hr;
    } catch (error) {
      console.error('Wrong field name.');
    }
  }
}
