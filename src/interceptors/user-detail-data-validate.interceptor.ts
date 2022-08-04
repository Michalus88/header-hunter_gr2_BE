import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { StudentProfileRegister } from 'types';
import { Reflector } from '@nestjs/core';
import { isCorrectGitHubUserAccount } from 'src/utils/is-correct-github-user';
import { isBoolean } from 'class-validator';

@Injectable()
export class UserDetailDataValidate implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const errors = {
      email: false,
      tel: false,
      firstName: false,
      lastName: false,
      githubUsername: false,
      portfolioUrls: false,
      projectUrls: false,
      bio: false,
      expectedTypeWork: false,
      targetWorkCity: false,
      expectedContractType: false,
      expectedSalary: false,
      canTakeApprenticeship: false,
      monthsOfCommercialExp: false,
      education: false,
      workExperience: false,
      courses: false,
    };
    const [req] = context.getArgs();
    const request = context.switchToHttp().getRequest();
    const {
      email,
      tel,
      firstName,
      lastName,
      githubUsername,
      portfolioUrls,
      projectUrls,
      bio,
      expectedTypeWork,
      targetWorkCity,
      expectedContractType,
      expectedSalary,
      canTakeApprenticeship = false,
      monthsOfCommercialExp = 0,
      education,
      workExperience,
      courses,
    } = req.body;

    if (email == undefined || !String(email).includes('@') || email.length < 1)
      errors.email = true;

    if (firstName == undefined || String(firstName).length == 0)
      errors.firstName = true;
    if (lastName == undefined || String(lastName).length == 0)
      errors.lastName = true;
    if (
      String(githubUsername).length == 0 ||
      isCorrectGitHubUserAccount(githubUsername)
    )
      errors.githubUsername = true;
    if (
      projectUrls == undefined ||
      Array(projectUrls).every((el) => !String(el).includes('github.com')) ||
      projectUrls.length < 1
    )
      errors.projectUrls = true;

    if (
      expectedTypeWork == undefined ||
      isNaN(Number(expectedTypeWork)) ||
      expectedTypeWork < 0 ||
      expectedTypeWork > 4
    )
      errors.expectedTypeWork = true;

    if (
      expectedContractType == undefined ||
      isNaN(Number(expectedContractType)) ||
      expectedContractType < 0 ||
      expectedContractType > 2
    )
      errors.expectedContractType = true;

    if (canTakeApprenticeship == undefined || !isBoolean(canTakeApprenticeship))
      errors.canTakeApprenticeship = true;

    if (
      monthsOfCommercialExp == undefined ||
      isNaN(Number(monthsOfCommercialExp)) ||
      monthsOfCommercialExp < 0 ||
      monthsOfCommercialExp > 780 //12 month * 65 yers old
    )
      errors.monthsOfCommercialExp = true;

    request.errors = errors;

    return next.handle();
  }
}
