import { Injectable } from '@nestjs/common';
import { BonusProjectUrl } from './student-bonus-project-url.entity';
import { ImportedStudentData, StudentStatus } from 'types';
import { StudentProfileActivationDto } from './dto/profile-register.dto';
import { StudentProfile } from './student-profile.entity';
import { StudentPortfolioUrl } from './student-portfolio-url.entity';
import { StudentProjectUrl } from './student-project-url.entity';
import { User } from '../user/user.entity';
import { validateActivationCredentials } from '../utils/validate-activation-credentials';
import { StudentGrades } from './student-grades.entity';

@Injectable()
export class StudentService {
  async getAvailable() {
    const availableStudents = await StudentProfile.find({
      relations: ['grades', 'projectUrls', 'bonusProjectUrls', 'portfolioUrls'],
      where: { status: StudentStatus.AVAILABLE },
    });

    return availableStudents;
  }

  async saveDataFromCsvToDb(student: ImportedStudentData, userId: string) {
    for (const url of student.bonusProjectUrls) {
      const bonusProjectUrl = new BonusProjectUrl();
      bonusProjectUrl.userId = userId;
      bonusProjectUrl.url = url;
      await bonusProjectUrl.save();

      const studentGrades = new StudentGrades();
      studentGrades.userId = userId;
      studentGrades.courseCompletion = student.courseCompletion;
      studentGrades.courseEngagement = student.courseEngagement;
      studentGrades.projectDegree = student.projectDegree;
      studentGrades.teamProjectDegree = student.teamProjectDegree;
      await studentGrades.save();
    }
  }

  async activateProfile(
    studentProfileActivation: StudentProfileActivationDto,
    userId: string,
    registerToken: string,
  ) {
    const user = await User.findOne({ where: { id: userId } });
    validateActivationCredentials(user, registerToken);
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
    const studentGrades = await StudentGrades.findOne({
      where: {
        userId: userId,
      },
    });

    const profile = new StudentProfile();
    profile.userId = userId;
    profile.email = user.email;
    profile.tel = tel ?? null;
    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.githubUsername = githubUsername;
    profile.grades = studentGrades;
    profile.bio = bio ?? null;
    profile.expectedTypeWork = expectedTypeWork;
    profile.targetWorkCity = targetWorkCity ?? null;
    profile.expectedContractType = expectedContractType;
    profile.expectedSalary = expectedSalary ?? null;
    profile.canTakeApprenticeship = canTakeApprenticeship ?? false;
    profile.monthsOfCommercialExp = monthsOfCommercialExp ?? 0;
    profile.education = education ?? null;
    profile.workExperience = workExperience ?? null;
    profile.courses = courses ?? null;
    await profile.save();

    const portfolioUrlsEntity = new StudentPortfolioUrl();
    if (portfolioUrls) {
      for (const url of portfolioUrls) {
        portfolioUrlsEntity.url = url;
        portfolioUrlsEntity.studentProfile = profile;
        await portfolioUrlsEntity.save();
      }
    }

    for (const url of projectUrls) {
      const projectUrlsEntity = new StudentProjectUrl();
      projectUrlsEntity.studentProfile = profile;
      projectUrlsEntity.url = url;
      await projectUrlsEntity.save();
    }

    const bonusProjectEntities = await BonusProjectUrl.find({
      where: {
        userId,
      },
    });
    for (const bonusProjectEntity of bonusProjectEntities) {
      bonusProjectEntity.studentProfile = profile;
      await bonusProjectEntity.save();
    }

    user.isActive = true;
    await user.save();
    return { statusCode: 201, message: 'Activation successful' };
  }
}
