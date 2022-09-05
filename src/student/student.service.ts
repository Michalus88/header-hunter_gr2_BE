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
  LoggedUserRes,
  Role,
  StudentStatus,
} from 'types';
import { StudentProfileDto } from './dto/profile-form.dto';
import { StudentProfile } from './student-profile.entity';
import { StudentPortfolioUrl } from './student-portfolio-url.entity';
import { StudentProjectUrl } from './student-project-url.entity';
import { User } from '../user/user.entity';
import { validateActivationCredentials } from '../utils/validate-activation-credentials';
import { DataSource } from 'typeorm';
import { StudentInfo } from './student-info.entity';
import { uuid } from 'uuidv4';
import { FilteringOptionsDto } from './dto/filtering-options.dto';
import { filteringQueryBuilder } from '../utils/filtering-query-builder';
import { AuthService } from '../auth/auth.service';
import { pagination } from 'src/utils/pagination';
import { MailService } from '../mail/mail.service';
import { HrProfile } from '../hr/hr-profile.entity';
import { ReservationService } from '../reservation/reservation.service';

@Injectable()
export class StudentService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    @Inject(forwardRef(() => MailService)) private mailService: MailService,
    @Inject(forwardRef(() => ReservationService))
    private reservationService: ReservationService,
  ) {}

  async activateProfile(
    studentProfileActivation: StudentProfileDto,
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

      if (portfolioUrls) {
        for (const url of portfolioUrls) {
          const portfolioUrlsEntity = new StudentPortfolioUrl();
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

  async markAsHired(user: User, res: Response, studentId?: string) {
    if (user.role === Role.STUDENT) {
      const student = await this.dataSource
        .createQueryBuilder()
        .select('student')
        .from(StudentProfile, 'student')
        .leftJoin('student.user', 'user')
        .where(
          'student.userId = :userId And user.isActive = true And NOT student.status = :hired',
          {
            userId: user.id,
            hired: StudentStatus.HIRED,
          },
        )
        .getOne();
      if (!student) {
        throw new BadRequestException('Student do not exist.');
      }
      student.status = StudentStatus.HIRED;
      await student.save();

      return this.authService.logout(res, {
        statusCode: 200,
        message: 'You mark as hired and lost access to the application.',
      });
    }
    const student = await this.dataSource
      .createQueryBuilder()
      .select([
        'student',
        'sInfo.firstName',
        'sInfo.lastName',
        'sInfo.tel',
        'sInfo.githubUsername',
        'user.email',
      ])
      .from(StudentProfile, 'student')
      .leftJoin('student.studentInfo', 'sInfo')
      .leftJoin('student.user', 'user')
      .where(
        'student.id = :studentId And user.isActive = true And NOT student.status = :hired',
        {
          studentId,
          hired: StudentStatus.HIRED,
        },
      )
      .getOne();
    if (!student) {
      throw new BadRequestException('Student do not exist.');
    }
    student.status = StudentStatus.HIRED;
    await student.save();
    const { studentInfo, user: userStudent } = student;
    const hr = await this.dataSource
      .createQueryBuilder()
      .select('hr')
      .from(HrProfile, 'hr')
      .where('hr.userId = :userId', { userId: user.id })
      .getOne();
    hr.maxReservedStudents += 1;
    await hr.save();
    await this.reservationService.remove(hr, studentId);
    await this.mailService.employmentNotification(
      userStudent.email,
      studentInfo.firstName,
      studentInfo.lastName,
      user.email,
      hr.firstName,
      hr.lastName,
      hr.company,
    );
    await this.mailService.employedStudentInfo(
      user.email,
      userStudent.email,
      studentInfo.tel,
      studentInfo.firstName,
      studentInfo.lastName,
      studentInfo.githubUsername,
    );

    res.json({
      statusCode: 200,
      message: "E-mail with the student's details has been sent",
    });
  }

  async getAllAvailable(
    maxPerPage: number,
    currentPage: number,
    filterQuery?: string,
    filterParameters?: Omit<
      FilteringOptionsDto,
      'expectedSalaryFrom' | 'expectedSalaryTo'
    >,
  ) {
    const parameters = filterParameters
      ? {
          ...filterParameters,
          hired: StudentStatus.HIRED,
        }
      : { hired: StudentStatus.HIRED };
    const allAvailable = (await this.dataSource
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
        'sInfo.expectedContractType',
        'sInfo.canTakeApprenticeship',
        'sInfo.workExperience',
        'sInfo.monthsOfCommercialExp',
        'sInfo.githubUsername',
      ])
      .from(StudentProfile, 'student')
      .leftJoin('student.user', 'user')
      .leftJoin('student.studentInfo', 'sInfo')
      .where(
        `user.isActive = true AND NOT student.status = :hired ${
          filterQuery ?? ''
        }`,
        parameters,
      )
      .getMany()) as unknown as AvailableStudentRes[];
    return pagination(allAvailable, Number(maxPerPage), Number(currentPage));
  }

  async getFilteredStudents(
    filteringOptions: FilteringOptionsDto,
    maxPerPage: number,
    currentPage: number,
  ) {
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
    const filterQuery = filteringQueryBuilder(filteringOptions);
    return await this.getAllAvailable(
      maxPerPage,
      currentPage,
      filterQuery,
      parameters,
    );
  }

  async getDetailedStudent(user: User, studentId?: string) {
    let email: string;
    let id: string;
    switch (user.role) {
      case Role.STUDENT:
        const data = await this.dataSource
          .createQueryBuilder()
          .select(['student.id'])
          .from(StudentProfile, 'student')
          .leftJoin('student.user', 'user')
          .where('student.userId = :userId And user.isActive = true', {
            userId: user.id,
          })
          .getOne();
        if (!data) {
          throw new BadRequestException(
            'Student do not exist or you have not access.',
          );
        }
        email = user.email;
        id = data.id;
        break;
      case Role.HR || Role.ADMIN:
        const userData = await this.dataSource
          .createQueryBuilder()
          .select(['user.email', 'student.id'])
          .from(StudentProfile, 'student')
          .leftJoin('student.user', 'user')
          .where('student.id = :studentId And user.isActive = true', {
            studentId,
          })
          .getOne();
        if (!userData) {
          throw new BadRequestException('Student do not exist.');
        }
        email = userData.user.email;
        id = studentId;
        break;
      default:
        throw new BadRequestException('Wrong user role.');
    }
    const detailedStudent = await StudentProfile.findOne({
      relations: ['studentInfo', 'bonusProjectUrls'],
      where: { id },
    });

    return { email, ...detailedStudent };
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

  async studentProfileUpdate(
    user: User,
    studentProfileUpdateDto: StudentProfileDto,
  ) {
    const student = await this.dataSource
      .createQueryBuilder()
      .select(['student.id', 'sInfo.id'])
      .from(StudentProfile, 'student')
      .leftJoin('student.studentInfo', 'sInfo')
      .leftJoin('student.user', 'user')
      .where('student.userId = user.id')
      .getOne();
    if (!student) {
      throw new BadRequestException('The student do not exist.');
    }
    const { studentInfo: sInfo } = student;
    const studentInfo = await StudentInfo.findOneBy({ id: sInfo.id });
    if (!studentInfo) {
      throw new BadRequestException('The student is not activate.');
    }
    try {
      const {
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

        return {
          statusCode: 200,
          message: 'Success.',
        };
      }
    } catch (err) {
      if (err.errno && err.errno === 1062) {
        throw new BadRequestException(
          'Sorry. Student with the given gitHub name is register.',
        );
      }
      throw new InternalServerErrorException();
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
