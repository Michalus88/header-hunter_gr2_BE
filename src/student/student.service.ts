import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { BonusProjectUrl } from './student-bonus-project-url.entity';
import {
  AvailableStudentRes,
  ImportedStudentData,
  StudentStatus,
  LoggedUserRes,
  Role,
} from 'types';
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
import { FilteringOptionsDto } from './dto/filtering-options.dto';
import { filteringQueryBuilder } from '../utils/filtering-query-builder';
import { AuthService } from '../auth/auth.service';
import { pagination } from 'src/utils/pagination';

@Injectable()
export class StudentService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}

  async activateProfile(
    studentProfileActivation: StudentProfileActivationDto,
    userId: string,
    registerToken: string,
  ) {
    const user = await User.findOneBy({ id: userId });
    validateActivationCredentials(user, registerToken);
    if (user.role !== Role.STUDENT) {
      throw new ForbiddenException('Only for student activation.');
    }
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

  async getMe(user: User): Promise<LoggedUserRes> {
    const student = await this.dataSource
      .createQueryBuilder()
      .select(['sInfo.firstName', 'sInfo.lastName', 'student.id'])
      .from(StudentProfile, 'student')
      .leftJoin('student.studentInfo', 'sInfo')
      .where('student.userId = :userId', { userId: user.id })
      .getOne();
    const { firstName, lastName } = student.studentInfo;
    return {
      id: user.id,
      role: user.role,
      firstName,
      lastName,
      email: user.email,
    };
  }

  async getAllAvailable(
    filterQuery?: string,
    filterParameters?: Omit<
      FilteringOptionsDto,
      'expectedSalaryFrom' | 'expectedSalaryTo'
    >,
  ) {
    const parameters = filterParameters
      ? { ...filterParameters, available: StudentStatus.AVAILABLE }
      : { available: StudentStatus.AVAILABLE };
    await this.verificationStudentBookingTime();
    return (await this.dataSource
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
      .where(
        `user.isActive = true AND student.status = :available
        ${filterQuery ?? ''}`,
        parameters,
      )
      .getMany()) as unknown as AvailableStudentRes[];
  }

  async getAllAvailableWhitPagination(
    maxPerPage?: number,
    currentPage?: number,
  ) {
    const allAvailable = await this.getAllAvailable();
    return pagination(allAvailable, Number(maxPerPage), Number(currentPage));
  }

  async getReservedStudents(user: User) {
    await this.verificationStudentBookingTime();
    return this.dataSource
      .createQueryBuilder()
      .select([
        'hrProfile',
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

  async getFilteredStudents(filteringOptions: FilteringOptionsDto) {
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
    const filterQuery = filteringQueryBuilder(filteringOptions);

    return this.getAllAvailable(filterQuery, parameters);
  }

  async getDetailedStudent(user: User, studentId: string) {
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

  async getAvailableStudent(studentId: string) {
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
    if (reservedStudents.length === 0) return;
    for (const student of reservedStudents) {
      if (isReservationValid(student.bookingDateTo)) {
        student.status = StudentStatus.AVAILABLE;
        student.bookingDateTo = null;
        student.hrProfile = null;
        await student.save();
      }
    }
  }

  async studentProfileUpdate(
    user: User,
    studentProfileUpdateDto: StudentProfileUpdateDto,
    studentId: string,
    res: Response,
  ) {
    let isMailEdited = false;
    const { studentInfo: sInfo } = await this.dataSource
      .createQueryBuilder()
      .select(['student.id', 'sInfo.id'])
      .from(StudentProfile, 'student')
      .leftJoin('student.studentInfo', 'sInfo')
      .where('student.id = :studentId', {
        studentId,
      })
      .getOne();
    if (!sInfo) {
      throw new BadRequestException('The student do not exist.');
    }
    const studentInfo = await StudentInfo.findOneBy({ id: sInfo.id });
    if (!studentInfo) {
      throw new BadRequestException('The student is not activate.');
    }
    const {
      email,
      firstName,
      lastName,
      tel,
      githubUsername,
      bio,
      expectedSalary,
      expectedTypeWork,
      targetWorkCity,
      expectedContractType,
      courses,
      canTakeApprenticeship,
      workExperience,
      monthsOfCommercialExp,
      education,
      projectUrls,
      portfolioUrls,
    } = studentProfileUpdateDto;

    if (email !== user.email) isMailEdited = true;
    user.email = email ?? user.email;
    studentInfo.firstName = firstName ?? studentInfo.firstName;
    studentInfo.lastName = lastName ?? studentInfo.lastName;
    studentInfo.tel = tel ?? studentInfo.tel;
    studentInfo.githubUsername = githubUsername ?? studentInfo.githubUsername;
    studentInfo.bio = bio ?? studentInfo.bio;
    studentInfo.expectedSalary = expectedSalary ?? studentInfo.expectedSalary;
    studentInfo.expectedTypeWork =
      expectedTypeWork ?? studentInfo.expectedTypeWork;
    studentInfo.targetWorkCity = targetWorkCity ?? studentInfo.targetWorkCity;
    studentInfo.expectedContractType =
      expectedContractType ?? studentInfo.expectedContractType;
    studentInfo.courses = courses ?? studentInfo.courses;
    studentInfo.canTakeApprenticeship =
      canTakeApprenticeship ?? studentInfo.canTakeApprenticeship;
    studentInfo.workExperience = workExperience ?? studentInfo.workExperience;
    studentInfo.monthsOfCommercialExp =
      monthsOfCommercialExp ?? studentInfo.monthsOfCommercialExp;
    studentInfo.education = education ?? studentInfo.education;
    await user.save();
    await studentInfo.save();

    if (portfolioUrls?.length && studentInfo.portfolioUrls?.length) {
      await this.removeUrls(studentInfo.portfolioUrls);
      await this.addUrls(StudentPortfolioUrl, portfolioUrls, studentInfo);
    } else if (portfolioUrls?.length) {
      await this.addUrls(StudentPortfolioUrl, portfolioUrls, studentInfo);
    }
    if (projectUrls.length > 0) {
      await this.removeUrls(studentInfo.projectUrls);
      await this.addUrls(StudentProjectUrl, projectUrls, studentInfo);
    }
    if (isMailEdited) {
      return this.authService.logout(res, {
        statusCode: 200,
        message: 'Success.If the email is edited you have to log in again',
      });
    } else {
      return res.json({
        statusCode: 200,
        message: 'Success.',
      });
    }
  }

  async addUrls(
    newEntity: typeof StudentPortfolioUrl | typeof StudentProjectUrl,
    urls: string[],
    studentInfo,
  ) {
    for (const url of urls) {
      const entityUrl = new newEntity();
      entityUrl.url = url;
      entityUrl.studentInfo = studentInfo;
      await entityUrl.save();
    }
  }

  async removeUrls(entityUrls: StudentPortfolioUrl[] | StudentProjectUrl[]) {
    for (const entity of entityUrls) {
      await entity.remove();
    }
  }
}
