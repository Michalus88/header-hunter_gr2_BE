import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BonusProjectUrl } from './student-bonus-project-url.entity';
import { ImportedStudentData, StudentStatus } from 'types';
import { StudentProfileActivationDto } from './dto/profile-register.dto';
import { StudentProfile } from './student-profile.entity';
import { StudentPortfolioUrl } from './student-portfolio-url.entity';
import { StudentProjectUrl } from './student-project-url.entity';
import { User } from '../user/user.entity';
import { validateActivationCredentials } from '../utils/validate-activation-credentials';
import { DataSource } from 'typeorm';
import { StudentInfo } from './student-info.entity';
import { uuid } from 'uuidv4';
import { isReservationValid } from '../utils/is-reservation-valid';
import { StudentProfileUpdateDto } from './dto/profile-update.dto';

@Injectable()
export class StudentService {
  constructor(private dataSource: DataSource) {}

  async activateProfile(
    studentProfileActivation: StudentProfileActivationDto,
    userId: string,
    registerToken: string,
  ) {
    const user = await User.findOneBy({ id: userId });
    validateActivationCredentials(user, registerToken);
    const studentProfile = await this.dataSource
      .createQueryBuilder()
      .select('studentProfile')
      .from(StudentProfile, 'studentProfile')
      .where('studentProfile.userId = :userId ', { userId })
      .getOne();
    const {
      tel,
      firstName,
      lastName,
      githubUsername,
      portfolioUrls,
      projectUrls,
      bio,
      expectedSalary,
      targetWorkCity,
      expectedTypeWork,
      expectedContractType,
      courses,
      canTakeApprenticeship,
      education,
      workExperience,
      monthsOfCommercialExp,
    } = studentProfileActivation;
    try {
      const studentInfo = new StudentInfo();
      studentInfo.id = uuid();
      studentInfo.tel = tel ?? null;
      studentInfo.firstName = firstName;
      studentInfo.lastName = lastName;
      studentInfo.githubUsername = githubUsername;
      studentInfo.bio = bio ?? null;
      studentInfo.expectedTypeWork = expectedTypeWork;
      studentInfo.targetWorkCity = targetWorkCity ?? null;
      studentInfo.expectedContractType = expectedContractType;
      studentInfo.expectedSalary = expectedSalary ?? null;
      studentInfo.canTakeApprenticeship = canTakeApprenticeship ?? false;
      studentInfo.monthsOfCommercialExp = monthsOfCommercialExp ?? 0;
      studentInfo.education = education ?? null;
      studentInfo.workExperience = workExperience ?? null;
      studentInfo.courses = courses ?? null;
      await studentInfo.save();

      studentProfile.studentInfo = studentInfo;
      await studentProfile.save();

      const portfolioUrlsEntity = new StudentPortfolioUrl();
      if (portfolioUrls) {
        for (const url of portfolioUrls) {
          portfolioUrlsEntity.url = url;
          portfolioUrlsEntity.studentInfo = studentInfo;
          await portfolioUrlsEntity.save();
        }
      }

      for (const url of projectUrls) {
        const projectUrlsEntity = new StudentProjectUrl();
        projectUrlsEntity.studentInfo = studentInfo;
        projectUrlsEntity.url = url;
        await projectUrlsEntity.save();
      }

      user.registerToken = null;
      user.isActive = true;
      await user.save();
      return { statusCode: 201, message: 'Activation successful' };
    } catch (err) {
      if (err.errno && err.errno === 1062) {
        throw new BadRequestException(
          'Sorry. Student with the given gitHub name is register.',
        );
      }
      throw new InternalServerErrorException();
    }
  }

  async getAllAvailable() {
    await this.verificationStudentBookingTime();
    return (
      this.dataSource
        .createQueryBuilder()
        .select([
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
          'sInfo.targetWorkCity',
          'sInfo.expectedSalary',
          'sInfo.canTakeApprenticeship',
          'sInfo.monthsOfCommercialExp',
        ])
        .from(StudentProfile, 'student')
        .leftJoin('student.user', 'user')
        .leftJoin('student.studentInfo', 'sInfo')
        // .leftJoin('student.hrProfile', 'hrProfile')
        .where('user.isActive = true AND student.status = :available', {
          available: StudentStatus.AVAILABLE,
        })
        .getMany()
    );
  }

  async getReservedStudents(user: User) {
    await this.verificationStudentBookingTime();
    return this.dataSource
      .createQueryBuilder()
      .select([
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
        'sInfo.canTakeApprenticeship',
        'sInfo.monthsOfCommercialExp',
      ])
      .from(StudentProfile, 'student')
      .leftJoin('student.user', 'user')
      .leftJoin('student.studentInfo', 'sInfo')
      .leftJoin('student.hrProfile', 'hrProfile')
      .where('hrProfile.userId = :userId ', { userId: user.id })
      .getMany();
  }

  async getDetailedStudent(user: User, studentId: string) {
    console.log(studentId);
    return this.dataSource
      .createQueryBuilder()
      .select(['student', 'sInfo', 'user.email'])
      .from(StudentProfile, 'student')
      .leftJoin('student.user', 'user')
      .leftJoin('student.studentInfo', 'sInfo')
      .leftJoin('student.hrProfile', 'hrProfile')
      .where('hrProfile.userId = :userId AND student.id = :studentId', {
        userId: user.id,
        studentId,
      })
      .getOne();
  }

  async saveDataFromCsvToDb(student: ImportedStudentData, user: User) {
    const studentProfile = new StudentProfile();
    studentProfile.id = uuid();
    studentProfile.user = user;
    studentProfile.courseCompletion = student.courseCompletion;
    studentProfile.courseEngagement = student.courseEngagement;
    studentProfile.projectDegree = student.projectDegree;
    studentProfile.teamProjectDegree = student.teamProjectDegree;
    await studentProfile.save();

    for (const url of student.bonusProjectUrls) {
      const bonusProjectUrl = new BonusProjectUrl();
      bonusProjectUrl.studentProfile = studentProfile;
      bonusProjectUrl.url = url;
      await bonusProjectUrl.save();
    }
  }

  async isStudentBooked(studentId: string) {
    const studentProfile = await this.dataSource
      .createQueryBuilder()
      .select('student')
      .from(StudentProfile, 'student')
      .leftJoin('student.user', 'user')
      .where('student.id = :studentId AND user.isActive = true ', { studentId })
      .getOne();

    if (!studentProfile) {
      throw new BadRequestException(
        `The student with the id: ${studentId} do not exists.`,
      );
    }
    if (studentProfile.status === StudentStatus.HIRED) {
      throw new ForbiddenException('This student is already hired.');
    }
    if (studentProfile.bookingDateTo) {
      throw new ForbiddenException(
        `The Student with the id: ${studentId} is already booked.`,
      );
    }
    return studentProfile;
  }

  async verificationStudentBookingTime() {
    const reservedStudents = await this.dataSource
      .createQueryBuilder()
      .select(['student'])
      .from(StudentProfile, 'student')
      .where('student.status = :reserved ', {
        reserved: StudentStatus.RESERVED,
      })
      .getMany();

    for (const student of reservedStudents) {
      console.log(student);
      if (isReservationValid(student.bookingDateTo)) {
        console.log(student);
        student.status = StudentStatus.AVAILABLE;
        student.bookingDateTo = null;
        student.hrProfile = null;
        await student.save();
      }
    }
  }

  async studentProfileUpdate(
    studentProfile: StudentProfileUpdateDto,
    studentId,
  ) {
    // return await this.dataSource
    //   .createQueryBuilder()
    //   // .select(['student', 'sPortfolioUrl'])
    //   .select(['student', 'sInfo', 'projectUrl'])
    //   .from(StudentProfile, 'student')
    //   .addFrom(StudentPortfolioUrl, 'portfolioUrl')
    //   .addFrom(StudentProjectUrl, 'projectUrl')
    //   .leftJoin('student.studentInfo', 'sInfo')
    //   // .leftJoin('portfolioUrl.studentInfo', 'sPortfolioUrl')
    //   // .leftJoin('student.bonusProjectUrls', 'bProjectUrls')
    //   .leftJoin('studentProjectUrl.studentInfo', 'projectUrl')
    //   .where('student.userID = :studentId', {
    //     studentId,
    //   })
    //   .getMany();
  }
}
