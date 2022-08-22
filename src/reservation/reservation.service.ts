import { BadRequestException, Injectable } from '@nestjs/common';
import { Reservation } from './reservation.entity';
import { HrProfile } from '../hr/hr-profile.entity';
import { DataSource } from 'typeorm';
import { setMaxReservationTime } from '../utils/set-max-reservation-time';
import { StudentProfile } from '../student/student-profile.entity';
import { isReservationValid } from '../utils/is-reservation-valid';
import { FilteringOptionsDto } from '../student/dto/filtering-options.dto';
import { ReservedStudentRes, StudentStatus } from '../../types';
import { User } from '../user/user.entity';

@Injectable()
export class ReservationService {
  constructor(private dataSource: DataSource) {}

  async isStudentBooked(hrProfile: HrProfile, studentId: string) {
    const reservation = await this.dataSource
      .createQueryBuilder()
      .select(['reservation.id'])
      .from(Reservation, 'reservation')
      .where(
        'reservation.hrProfile = :hrId AND reservation.studentProfile = :studentId',
        { hrId: hrProfile.id, studentId },
      )
      .getOne();
    if (reservation) {
      throw new BadRequestException('Student is already on Your list.');
    }
  }

  async add(hrProfile: HrProfile, studentProfile: StudentProfile) {
    const reservation = new Reservation();
    reservation.bookingDateTo = setMaxReservationTime(10);
    reservation.hrProfile = hrProfile;
    reservation.studentProfile = studentProfile;
    await reservation.save();
  }

  async remove(hrId: string, studentId: string) {
    const reservation = await this.dataSource
      .createQueryBuilder()
      .select('reservation')
      .from(Reservation, 'reservation')
      .where(
        `reservation.hrProfile = :hrId AND reservation.studentProfile = :studentId`,
        { hrId, studentId },
      )
      .getOne();
    if (!reservation) {
      throw new BadRequestException('Reservation does not exist');
    }
    await reservation.remove();
    return {
      codeStatus: 200,
      message: `The student has been removed from the list`,
    };
  }

  async verificationStudentBookingTime() {
    const reservations = await Reservation.find();
    if (reservations.length === 0) return;
    for (const reservation of reservations) {
      if (isReservationValid(reservation.bookingDateTo)) {
        //Status update -ToDo
        await reservation.remove();
      }
    }
  }

  async getBookedStudents(
    hrId: string,
    query?: string,
    filterParameters?: Omit<
      FilteringOptionsDto,
      'expectedSalaryFrom' | 'expectedSalaryTo'
    >,
  ): Promise<ReservedStudentRes[]> {
    const parameters = filterParameters
      ? { ...filterParameters, hrId, hired: StudentStatus.HIRED }
      : { hrId, hired: StudentStatus.HIRED };
    const reservations = await this.dataSource
      .createQueryBuilder()
      .select([
        'reservation.bookingDateTo',
        'student.id',
        'student.courseCompletion',
        'student.courseEngagement',
        'student.projectDegree',
        'student.teamProjectDegree',
        'sInfo.firstName',
        'sInfo.lastName',
        'sInfo.expectedTypeWork',
        'sInfo.targetWorkCity',
        'sInfo.expectedSalary',
        'sInfo.expectedContractType',
        'sInfo.canTakeApprenticeship',
        'sInfo.monthsOfCommercialExp',
        'sInfo.githubUsername',
      ])
      .from(Reservation, 'reservation')
      .leftJoin('reservation.studentProfile', 'student')
      .leftJoin('reservation.hrProfile', 'hrProfile')
      .leftJoin('student.studentInfo', 'sInfo')
      .where(
        `reservation.hrProfile = :hrId AND NOT student.status = :hired ${
          query ?? ''
        } `,
        parameters,
      )
      .getMany();

    return reservations.map((reservation) => ({
      bookingDateTo: reservation.bookingDateTo,
      ...reservation.studentProfile,
    }));
  }
}
