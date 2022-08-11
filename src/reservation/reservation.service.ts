import { BadRequestException, Injectable } from '@nestjs/common';
import { Reservation } from './reservation.entity';
import { HrProfile } from '../hr/hr-profile.entity';
import { DataSource } from 'typeorm';
import { setMaxReservationTime } from '../utils/set-max-reservation-time';
import { StudentProfile } from '../student/student-profile.entity';
import { isReservationValid } from '../utils/is-reservation-valid';

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

  getBookedStudents(hr: HrProfile) {
    return this.dataSource
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
      ])
      .from(Reservation, 'reservation')
      .leftJoin('reservation.studentProfile', 'student')
      .leftJoin('reservation.hrProfile', 'hrProfile')
      .leftJoin('student.studentInfo', 'sInfo')
      .where('reservation.hrProfile = :hrId ', { hrId: hr.id })
      .getMany();
  }
}
