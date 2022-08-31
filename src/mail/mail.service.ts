import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendActivateLink(
    email: string,
    userId: string,
    registerToken: string,
    password: string,
  ) {
    const mail = {
      to: email,
      subject: 'Header Hunter account activation',
      from: 'headerhuntergr2@gmail.com',
      template: 'activation-link',
      context: {
        userId,
        registerToken,
        password,
      },
    };
    await this.mailerService.sendMail(mail);

    return {
      statusCode: 202,
      message: 'Activation successful! Check your email.',
    };
  }

  async sendPassword(email: string, password: string) {
    const mail = {
      to: email,
      subject: 'Header Hunter password',
      from: 'headerhuntergr2@gmail.com',
      template: 'new-password',
      context: {
        password,
      },
    };
    await this.mailerService.sendMail(mail);

    return {
      statusCode: 202,
      message: 'Activation successful! Check your email.',
    };
  }

  async employmentNotification(
    email: string,
    firstName: string,
    lastName: string,
    hrEmail: string,
    hrFirstName: string,
    hrLastName: string,
    company: string,
  ) {
    const mail = {
      to: 'michalus88@gmail.com',
      subject: 'Employment notification',
      from: 'headerhuntergr2@gmail.com',
      template: 'employment-notification',
      context: {
        email,
        firstName,
        lastName,
        hrEmail,
        hrFirstName,
        hrLastName,
        company,
      },
    };
    await this.mailerService.sendMail(mail);
  }

  async employedStudentInfo(
    emailTo: string,
    email: string,
    tel: string,
    firstName: string,
    lastName: string,
    githubUsername: string,
  ) {
    const mail = {
      to: emailTo,
      subject: 'Employed student info',
      from: 'headerhuntergr2@gmail.com',
      template: 'employed-student-info',
      context: {
        email,
        tel,
        firstName,
        lastName,
        githubUsername,
      },
    };
    await this.mailerService.sendMail(mail);
  }
}
